import React from "react"; 
import { useRecoilState } from "recoil"; 
import { themeMode } from "recoilStore/atoms"

function LoadingScreenNDL(props) { 
    const [CurTheme] = useRecoilState(themeMode)

    return (
        <div>
            <React.Fragment>
                <div style={{ top: 0, left: props.open ?"40px" :"250px", right: 0, bottom: 0, display: "flex", zIndex: 20, position: "fixed", alignItems: "center", justifyContent: "center", backgroundColor: CurTheme === "dark" ? "rgb(36 36 36 /0.7)"  : "rgb(0 0 0 / 20%)" }}>
                    {/* <Image src={loader} alt="Loader" width={100} ></Image> */}
                    <div class="customloader"></div>
                </div>
            </React.Fragment>
        </div>
    );

}

export default LoadingScreenNDL;