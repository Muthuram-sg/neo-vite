import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import moment from 'moment';
import EnhancedTable from "components/Table/Table";
import SelectBox from "components/Core/DropdownList/DropdownListNDL";
import { useTranslation } from 'react-i18next';
import { selectedPlant, customdates,  stdReportAsset,  themeMode } from "recoilStore/atoms";
import useGetRouteCardDetails from "./hooks/useGetRouteCardDetails";
import LoadingScreenNDL from "LoadingScreenNDL"



export default function RouteCard() {


    const { t } = useTranslation();
    const headCells = [
        {
            id: 'S.No',
            numeric: false,
            disablePadding: true,
            label: t('S.No'),

        },
        {
            id: 'Asset',
            numeric: false,
            disablePadding: true,
            label: t('Asset'),

        }, {
            id: 'Operator',
            numeric: false,
            disablePadding: true,
            label: t('Operator'),

        }, {
            id: 'Product',
            numeric: false,
            disablePadding: true,
            label: t('Product'),

        }, {
            id: 'Date',
            numeric: false,
            disablePadding: true,
            label: t('Date'),

        }, {
            id: 'Shift',
            numeric: false,
            disablePadding: true,
            label: t('Shift'),

        }, {
            id: 'Route Card No',
            numeric: false,
            disablePadding: true,
            label: t('Route Card No'),

        }, {
            id: 'Route Card Count',
            numeric: false,
            disablePadding: true,
            label: t('Route Card Count'),

        },

        {
            id: 'Production Count',
            numeric: false,
            disablePadding: true,
            label: t('Production Count'),

        },
    ]
    const [tabledata, setTableData] = useState([]);
    const [curTheme] = useRecoilState(themeMode);
    const [customVals] = useRecoilState(customdates)
    const [rawData, setrawData] = useState([])
    const [headPlant] = useRecoilState(selectedPlant);
    const { routeCardLoading, routeCardData, routeCardError, getRouteCardDetails } = useGetRouteCardDetails();
    const [selectedAsset] = useRecoilState(stdReportAsset);

    const prevSelectedAsset = useRef(null);
    const prevCustomVals = useRef(null);
    const prevHeadPlant = useRef(null);

    useEffect(() => {
        // Compare selectedAsset (by id), customVals (by StartDate/EndDate), and headPlant (by id)
        const isSameAsset =
            prevSelectedAsset.current !== null &&
            Array.isArray(selectedAsset) &&
            Array.isArray(prevSelectedAsset.current) &&
            selectedAsset.length === prevSelectedAsset.current.length &&
            selectedAsset.every((v, i) => v.id === prevSelectedAsset.current[i].id);

        const isSameCustomVals =
            prevCustomVals.current !== null &&
            customVals &&
            prevCustomVals.current &&
            customVals.StartDate === prevCustomVals.current.StartDate &&
            customVals.EndDate === prevCustomVals.current.EndDate;

        const isSameHeadPlant =
            prevHeadPlant.current !== null &&
            headPlant &&
            prevHeadPlant.current &&
            headPlant.id === prevHeadPlant.current.id;

        // Only skip if all are the same
        if (isSameAsset && isSameCustomVals && isSameHeadPlant) return;

        prevSelectedAsset.current = selectedAsset;
        prevCustomVals.current = customVals;
        prevHeadPlant.current = headPlant;

        if (selectedAsset && selectedAsset.length > 0 && headPlant && customVals) {
            const body = {
                "data": {
                    "schema": headPlant.schema,
                    "from": moment(customVals.StartDate).format("YYYY-MM-DDTHH:mm:ss"),
                    "to": moment(customVals.EndDate).format("YYYY-MM-DDTHH:mm:ss"),
                    "line_id": headPlant.id,
                    "key": ["part_counter", "route_card_no"],
                    "asserts": selectedAsset.map(x => {
                        return {
                            "id": x?.entity_id,
                            "instrument": x?.instrument?.id,
                            "name": x?.name
                        }
                    })
                }
            };
            getRouteCardDetails(body);
        } else {
            setTableData([]);
            setrawData([]);
        }
    }, [selectedAsset, headPlant, customVals])

    useEffect(() => {
        if (!routeCardLoading && !routeCardError && Array.isArray(routeCardData) && routeCardData.length > 0) {
            setrawData(routeCardData);
            let formattedData = routeCardData.map((item, index) => ([
                index + 1,
                item?.assert_name || '-',
                item?.operator_name || '-',
                item?.product_name || '-',
                item?.date || '-',
                item?.shift_name || '-',
                Array.isArray(item?.route_card_wise_parts) ? item.route_card_wise_parts.map(x => Object.keys(x)) : [],
                Array.isArray(item?.route_card_wise_parts) ? item.route_card_wise_parts.map(x => Object.values(x)) : [],
                item?.total_parts ?? '-'
            ]));
            setTableData(formattedData);
        } else {
            setTableData([]);
            setrawData([]);
        }
    }, [routeCardLoading, routeCardData, routeCardError]);

    function buildExcelDataAndMerges(data) {
        if (!Array.isArray(data)) return { result: [], merges: [] };
        const result = [
            [
                "S.No",
                "Asset",
                "Operator",
                "Product",
                "Date",
                "Shift",
                "Route Card No",
                "Route Card Count",
                "Production Count",
            ],
        ];
        const merges = [];
        let currentRow = 1;
        const columnsToMerge = [0, 1, 2, 3, 4, 5, 8];

        data.forEach((row) => {
            const routeLen = Array.isArray(row.routeCards) ? row.routeCards.length : 0;
            if (!row.routeCards) return;
            row.routeCards.forEach((rc, idx) => {
                result.push([
                    idx === 0 ? row.sno : "",
                    idx === 0 ? row.asset : "",
                    idx === 0 ? row.operator : "",
                    idx === 0 ? row.product : "",
                    idx === 0 ? row.date : "",
                    idx === 0 ? row.shift : "",
                    rc?.number,
                    rc?.count,
                    idx === 0 ? row.productionCount : "",
                ]);
            });
            if (routeLen > 1) {
                columnsToMerge.forEach((colIdx) => {
                    merges.push({
                        s: { r: currentRow, c: colIdx },
                        e: { r: currentRow + routeLen - 1, c: colIdx },
                    });
                });
            }
            currentRow += routeLen;
        });
        return { result, merges };
    }

    function buildExcelDataAndMergesGrouped(rawData, groupKey) {
        if (!Array.isArray(rawData)) return { result: [], merges: [] };
        //----------------------------------------------------------
        // 1.  Constants
        //----------------------------------------------------------
        const DISPLAY_HEADER = [
            "S.No",
            "Asset",
            "Operator",
            "Product",
            "Date",
            "Shift",
            "Route Card No",
            "Route Card Count",
            "Production Count",
        ];
        const keyValue = groupKey.toLowerCase() || "shift"; // default to 'shift' if not provided
        const COLS_TO_MERGE = [0, 1, 2, 3, 4, 5, 8]; // same as before

        //----------------------------------------------------------
        // 2.  Prepare containers
        //----------------------------------------------------------
        const result = [];
        const merges = [];

        //----------------------------------------------------------
        // 3.  Filter‑out non‑data rows (the first two objects
        //     you included are only metadata / header info)
        //----------------------------------------------------------
        const data = rawData.filter(r => typeof r?.sno === "number");

        //----------------------------------------------------------
        // 4.  Group rows by shift while preserving natural order
        //----------------------------------------------------------
        const groups = new Map();          // insertion‑ordered
        data.forEach(row => {
            if (!groups.has(row[keyValue])) groups.set(row[keyValue], []);
            groups.get(row[keyValue]).push(row);
        });

        //----------------------------------------------------------
        // 5.  Walk every group
        //----------------------------------------------------------
        let currentRow = 0;

        groups.forEach((rowsInShift, shiftLabel) => {
            /* 5‑a  SHIFT BANNER ROW (merged across all columns) */
            result.push([shiftLabel]);   // only first cell gets text
            merges.push({
                s: { r: currentRow, c: 0 },
                e: { r: currentRow, c: DISPLAY_HEADER.length - 1 },
            });
            currentRow++;

            /* 5‑b  GROUP‑SPECIFIC HEADER ROW */
            result.push([...DISPLAY_HEADER]);
            currentRow++;

            /* 5‑c  DATA ROWS */
            rowsInShift.forEach(row => {
                const routeLen = Array.isArray(row.routeCards) ? row.routeCards.length : 0;
                const rowStart = currentRow;
                if (!row.routeCards) return;
                row.routeCards.forEach((rc, idx) => {
                    result.push([
                        idx === 0 ? row.sno : "",
                        idx === 0 ? row.asset : "",
                        idx === 0 ? row.operator : "",
                        idx === 0 ? row.product : "",
                        idx === 0 ? row.date : "",
                        idx === 0 ? row.shift : "",
                        rc?.number,
                        rc?.count,
                        idx === 0 ? row.productionCount : "",
                    ]);
                    currentRow++;
                });
                if (routeLen > 1) {
                    COLS_TO_MERGE.forEach(colIdx => {
                        merges.push({
                            s: { r: rowStart, c: colIdx },
                            e: { r: rowStart + routeLen - 1, c: colIdx },
                        });
                    });
                }
            });
        });

        return { result, merges };
    }

    const unFormatedData = (data) => {
        if (!Array.isArray(data)) return [];
        const unformat = data.map((item) => {
            // Route Card No and Route Card Count are arrays of arrays
            const routeCardNumbers = Array.isArray(item?.["Route Card No"]) ? item["Route Card No"]?.[0] || [] : [];
            const routeCardCounts = Array.isArray(item?.["Route Card Count"]) ? item["Route Card Count"]?.[0] || [] : [];
            const routeCards = routeCardNumbers.map((number, idx) => ({
                number: number === "0" ? "-" : number,
                count: routeCardCounts[idx] ?? "",
            }));

            return {
                sno: item?.["S.No"],
                asset: item?.["Asset"],
                operator: item?.["Operator"],
                product: item?.["Product"] ?? "-",
                date: item?.["Date"],
                shift: item?.["Shift"],
                routeCards,
                productionCount: item?.["Production Count"],
            };
        });
        return unformat;
    }


    return (
        <React.Fragment>
            {
                routeCardLoading && <LoadingScreenNDL />
            }
            <div className="p-4">
                <EnhancedTable
                    headCells={headCells}
                    data={Array.isArray(tabledata) ? tabledata : []}
                    isSpanRows={true}
                    style={{ backgroundColor: curTheme === 'dark' ? "#000000" : "#ffff" }}
                    search={true}
                    download={true}
                    rawdata={Array.isArray(rawData) ? rawData : []}
                    verticalMenu={true}
                    groupBy={'route_card'}
                    buildExcelDataAndMerges={buildExcelDataAndMerges}
                    buildExcelDataAndMergesGrouped={buildExcelDataAndMergesGrouped}
                    unFormatedData={unFormatedData}
                    arrayKey={"Route Card No"}
                    downFileName={"RouteCardDetails"}
                />
            </div>

        </React.Fragment>
    )
}