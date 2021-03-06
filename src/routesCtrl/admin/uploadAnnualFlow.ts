import { Request, Response } from "express";
import { from, of } from "rxjs";
import { map, mergeMap, concatMap, catchError, delay } from "rxjs/operators";

import { AnnualFlow, IAnnualFlow } from "../../db/models";
import { gauges } from "../../static";
import {
  readCSVFile,
  readStringToArrays,
  transposeArray,
  IReadStringToArrayPL,
  ITransposeArrayPL,
  IArrayPL
} from "./helpers";

interface IObj {
  [index: string]: any;
}
interface IReport {
  data: IObj;
  meta: { gaugeCount: number; rowCount: number };
}

interface ISub {
  annualFlowArray: IAnnualFlow[];
  gaugeId: number;
}

export const uploadAnnualFlow = async (_: Request, res: Response) => {
  await AnnualFlow.destroy({ where: {} });
  const report: IReport = {
    data: {},
    meta: { gaugeCount: 0, rowCount: 0 }
  };
  let result: IAnnualFlow[] = [];

  const src$ = from(gauges).pipe(
    concatMap(x => of(x).pipe(delay(300))),
    mergeMap(gauge => readCSVFile(gauge.id, "annual_flow_matrix")),
    mergeMap((d: IReadStringToArrayPL) => readStringToArrays(d)),
    map((d: ITransposeArrayPL) => transposeArray(d)),
    map((d: IArrayPL) => createAnnualFlowArray(d)),
    catchError(error => of(`Bad Promise: ${error}`))
  );
  src$.subscribe(
    ({ annualFlowArray, gaugeId }: ISub) => {
      report.data[gaugeId] = annualFlowArray.length;
      report.meta.gaugeCount += 1;
      report.meta.rowCount += annualFlowArray.length;
      result = result.concat(annualFlowArray);
    },
    (error: any) => res.status(400).send(error),
    () => AnnualFlow.bulkCreate(result).then(d => res.status(200).send(report))
  );
};

const createAnnualFlowArray = ({ arrayData, id }: IArrayPL): ISub => {
  const annualFlowArray: IAnnualFlow[] = arrayData.map((ary: number[]) => ({
    year: ary[0],
    flowData: ary.slice(1),
    gaugeId: <number>id
  }));

  return { annualFlowArray, gaugeId: <number>id };
};
