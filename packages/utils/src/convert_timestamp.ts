// Convert an integer (12.5) to a time string (12:30 P.M)
export default function getTimestamp(time: number) {
    let str = time.toPrecision(4).split(".");
    let period: string;

    if (time >= 12) {
        period = "P.M";
        let num = parseInt(str[0]);
        str[0] = (num > 12 ? num - 12 : num).toString();
    } else {
        period = "A.M";
    }

    str[1] = Math.round(60 * parseFloat("0." + str[1])).toString();
    
    return `${str[0]}:${parseInt(str[1]) < 10 ? "0" + str[1] : str[1]} ${period}`;
}