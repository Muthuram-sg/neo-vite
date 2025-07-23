import { useEffect, useState } from "react";

const useReleaseNotes = () => {
    const [releaseloading, setLoading] = useState(true);
    const [releasedata, setData] = useState([])
  
    const fetchApi = () => {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };
  
      let gqlBody = {
    query: `query MyQuery {
      releaseNote {
      author
      createdAt
      createdBy {
      name
    }
    content {
     html
     }
    updatedAt
     heading
     id
     publishdate
    publishedBy {
    name
     }
     category
     }
    }  `,
        variables: "{}",
    };
  
      let bodyContent = JSON.stringify(gqlBody);
      setLoading(true);
      fetch(
        "https://api-ap-south-1.graphcms.com/v2/cl30bmkea0eeb01xmch23cq0a/master",
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (d) {
        //  console.log("d.data.releaseNote",d.data.releaseNote)
          setData(d.data.releaseNote);
          setLoading(false);
          
        })
        .catch((e) => console.log(e));
    };
  
    useEffect(() => {
      fetchApi();
    }, []);
  
    return { releaseloading, releasedata };
}
    
export default useReleaseNotes;





