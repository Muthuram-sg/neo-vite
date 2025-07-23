import { useState, useEffect } from "react";
import configParam from "config";
import Queries from 'components/layouts/Queries';

const useFavoriteStatus = (scadaId, lineId, userId) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const response = await configParam.RUN_GQL_API(Queries.SelectedsavedScadafav, { scada_id: scadaId, line_id: lineId, user_id: userId });
                if (response?.neo_skeleton_scada_dash_star_fav?.length > 0) {
                    setIsFavorite(true);
                } else {
                    setIsFavorite(false);
                }
            } catch (error) {
                console.error("Error fetching favorite status:", error);
            }
        };

        if (scadaId && lineId && userId) {
            checkFavoriteStatus();
        }
    }, [scadaId, lineId, userId]);

    return isFavorite;
};

export default useFavoriteStatus;
