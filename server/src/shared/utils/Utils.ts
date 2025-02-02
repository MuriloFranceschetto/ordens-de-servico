import * as moment from "moment";

export function formatedDateIfValid({value}): string {
    if (value) {
        let m = moment(value);
        if (m.isValid()) {
            return m.format('YYYY-MM-DDTHH:mm');
        }
    }
    return null;
}