import { useState } from "react";
import configParam from "config";

const useGetHistory = () => {
    const [HistoryLoading, setLoading] = useState(false);
    const [HistoryData, setData] = useState(null);
    const [HistoryError, setError] = useState(null);

    const parseValues = (valueString) => {
        const parsed = {};
        valueString?.split(", ").forEach((item) => {
            const [key, value] = item.split("=>").map((str) => str.trim());
            parsed[key.replace(/\"/g, "")] = value?.replace(/\"/g, "");
        });
        return parsed;
    };

    const getHistory = async (id) => {
        setLoading(true);

        const url = "/tasks/sensorHistory";

        await configParam
            .RUN_REST_API(url, { id: id })
            .then((response) => {
                if (response && !response.errorTitle) {
                    const history = [];

                    response.data.forEach((entry) => {
                        const oldValues = parseValues(entry.old_values);
                        const newValues = parseValues(entry.new_values);

                        const filteredColumns = entry.updated_cols?.filter((col) => {
                            if (col === 'updated_by') {
                                // Always consider 'updated_by' column regardless of changes
                                return true;
                            }

                            const oldValue = oldValues?.[col];
                            const newValue = newValues?.[col];
                            return oldValue !== newValue;
                        });

                        if (filteredColumns && filteredColumns.length > 0) {
                            const columnChanges = filteredColumns.map((col) => {
                                const oldValue = oldValues?.[col] || "N/A";
                                const newValue = newValues?.[col] || "N/A";
                                return `${col}: ${oldValue} -> ${newValue}`;
                            });

                            const existingRecord = history.find(
                                (record) => record.action_time === entry.action_timestamp
                            );

                            if (existingRecord) {
                                existingRecord.action = `u`;
                                existingRecord.value = filteredColumns.join(", ");
                                existingRecord.data = columnChanges.join(", ");
                            } else {
                                history.push({
                                    action_time: entry.action_timestamp,
                                    action: `u`,
                                    value: filteredColumns.join(", "),
                                    data: columnChanges.join(", "),
                                });
                            }
                        } 
                        // else if (!entry.updated_cols) {
                        //     history.push({
                        //         action_time: entry.action_timestamp,
                        //         action: "i",
                        //         value: "Sensor Created",
                        //     });
                        // }
                    });

                    history.sort((a, b) => new Date(b.action_time) - new Date(a.action_time));

                    // Format action_time in dd/mm/yyyy hh:mm:ss
                    history.forEach((entry) => {
                        const date = new Date(entry.action_time);
                        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${
                            (date.getMonth() + 1).toString().padStart(2, "0")}/${
                            date.getFullYear()} ${
                            date.getHours().toString().padStart(2, "0")}:${
                            date.getMinutes().toString().padStart(2, "0")}:${
                            date.getSeconds().toString().padStart(2, "0")}`;

                        entry.action_time = formattedDate;
                    });

                    setData(history);
                    setError(false);
                } else {
                    setData([]);
                    setError(true);
                }

                setLoading(false);
            })
            .catch((e) => {
                console.error("Error fetching history:", e);
                setLoading(false);
                setError(true);
                setData([]);
            });
    };

    return { HistoryLoading, HistoryData, HistoryError, getHistory };
};

export default useGetHistory;

