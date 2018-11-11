import axios from 'axios';
import {
  TsUpload,
  UploadTimeSeriesPL,
  RequestWithUser,
  TSCalcResponse,
} from './models';

export class tsUploadServices {
  TsUpload = TsUpload;
  flaskServerUrl = process.env.EFLOW_FLASK_URL;

  public async uploadTimeSeries(pl: UploadTimeSeriesPL, req: RequestWithUser) {
    if (!pl.dates || !pl.flows || !pl.startDate) {
      throw 'dates, flows and startDate must be provided';
    }
    try {
      const axiosRes = await axios.post(this.flaskServerUrl, pl);
      const tsCal: TSCalcResponse = JSON.parse(axiosRes.data.body);

      this.TsUpload.create({
        ...pl,
        succeed: true,
        userId: req.user.id,
        name: req.user.name,
        flowMatrix: tsCal.flow_matrix,
        DRH: tsCal.DRH,
        allYear: tsCal.all_year,
        winter: tsCal.winter,
        fall: tsCal.fall,
        summer: tsCal.summer,
        spring: tsCal.spring,
        fallWinter: tsCal.fall_winter,
        yearRanges: tsCal.year_ranges,
      });
    } catch (error) {
      this.TsUpload.create({
        ...pl,
        succeed: false,
        userId: req.user.id,
        name: req.user.name,
      });
      throw error;
    }
  }
}
