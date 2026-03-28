
import { useEffect, useState } from "react";
import { tradingData } from "../../data";
import Card from "app/assets/common/card";
import { getCommodity, CommodityData } from "app/services/api";

interface TradingData {
    Close: number,
    High: number,
    Low: number, 
    Open: number, 
    Volume: number
}

interface TradingDataProps{
    commodityId:string
}

const TradingData = (props: TradingDataProps) => {
    const {commodityId} = props;
    const [inputCommodity, setInputCommodity] = useState<string>("");
    const lastFivePoints = tradingData.slice(Math.max(tradingData.length - 5, 1));
    const [dataPoints, setDataPoints] = useState<CommodityData[]>([]);

    const fetchData = async () => {
        getCommodity(commodityId)
            .then((data) => {
                setDataPoints(data);
                console.log(data);
            })
            .catch((error) => {
                setDataPoints([]);
                console.log(error);
            });
    }

    useEffect(() => { fetchData() }, [commodityId])
    function getStandardDeviation(array: any[]) {
        const n = array.length
        const mean = array.reduce((a: number, b: number) => a + b, 0) / n
        return Math.sqrt(array.map((x: number) => Math.pow(x - mean, 2)).reduce((a: number, b: number) => a + b, 0) / n)
    }

    // useEffect(() => {
    //     const interval = setInterval(() => {fetchData()}, 10000)
        
    // },[apiURL])

    return <div>
        <Card cardTitle={commodityId.toUpperCase()} description={
            <>
            Close For {commodityId.toUpperCase()}: {dataPoints[dataPoints.length-1]?.Close}
            <div>Standard Deviation of {commodityId.toUpperCase()}: {getStandardDeviation(dataPoints.map(x => x.Close))}</div></>
        } />
    </div>
}
export default TradingData;