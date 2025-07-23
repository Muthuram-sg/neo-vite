import { useState } from "react";
import configParam from "config";
import Mutation from "components/layouts/Mutations";
import Queries from 'components/layouts/Queries';

const useCreateScadaFavourite = () => {
    const [CreateScadaFavouriteLoading, setLoading] = useState(false); 
    const [CreateScadaFavouriteError, setError] = useState(null); 
    const [CreateScadaFavouriteData, setData] = useState(null); 

    const getCreateScadaFavourite = async (body) => {
        setLoading(true);

      
        try {
            // Check if favorite already exists
            const existingScadaDashFav = await configParam.RUN_GQL_API(
                Queries.SelectedsavedScadafav,
                { scada_id: body.scada_id, user_id: body.user_id, line_id: body.line_id }
            );

            // If already favorited, remove it
            if (existingScadaDashFav.neo_skeleton_scada_dash_star_fav.length > 0) {
                const removeData = await configParam.RUN_GQL_API(Mutation.RemoveScadaFavouriteDash, body);
                
                if (removeData && removeData.delete_neo_skeleton_scada_dash_star_fav) {
                    setData(null);
                    setError("SCADA Dashboard removed from favorites.");
                } else {
                    setError("Failed to remove SCADA Dashboard from favorites.");
                }
            } 
            // If not favorited, add it
            else {
                const addData = await configParam.RUN_GQL_API(Mutation.AddScadaFavouriteDash, body);
                
                if (addData && addData.insert_neo_skeleton_scada_dash_star_fav) {
                    setData(addData.insert_neo_skeleton_scada_dash_star_fav);
                    setError(null);
                } else {
                    setError("Failed to add SCADA Dashboard to favorites.");
                }
            }
        } catch (e) {
            setError("Error toggling favorite status.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return { CreateScadaFavouriteLoading, CreateScadaFavouriteData, CreateScadaFavouriteError, getCreateScadaFavourite };
};

export default useCreateScadaFavourite;
