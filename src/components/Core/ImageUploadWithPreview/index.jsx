import { useEffect, useState } from "react";
import PlusIcon from 'assets/neo_icons/Menu/plus_icon.svg?react';
import ImageVectorIcon from 'assets/neo_icons/ChatBot/ChatBot_minimize-icon.svg?react';

export default function ImageUploadwithPreview(props) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState()

  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     // setFile(selectedFile);
  //     // setPreview(URL.createObjectURL(selectedFile));
  //     props.handleFile(selectedFile)
  //   }
  // };

  useEffect(() => {
    // if(props.asset !== null){
    //   setPreview(URL.createObjectURL(props.asset))
    // }
  }, [props?.asset])

  const handleRemoveFile = () => {
    props.removeFile()
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="flex flex-col">
      <div className="relative w-32 h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
        {props.asset ? (
          <>
          { console.log(typeof props.asset, props?.asset)}
            <img src={props?.asset instanceof File ? URL.createObjectURL(props?.asset) : props?.asset !== null ? typeof props?.asset === 'object' ? URL.createObjectURL(props?.asset) : props?.asset : null} alt="Preview" className="w-full h-full rounded-lg object-cover" />
            {/* <img src={props?.asset instanceof File ? URL.createObjectURL(props?.asset) : props?.asset !== null ? URL.createObjectURL(props?.asset) : null} alt="Preview" className="w-full h-full rounded-lg object-cover" /> */}
            <button onClick={handleRemoveFile} className="absolute top-2 right-2 bg-red-500 text-white rounded-full">
              <ImageVectorIcon />
            </button>
          </>
        ) : (

          <label htmlFor={`file-upload_${props?.id}`} className="cursor-pointer text-gray-500 text-2xl">
            +
          </label>
        )}
      </div>
      <input id={`file-upload_${props?.id}`} type="file" accept=".png, .svg" className="hidden"  onChange={(e) => props.handleFile(e.target.files[0]) } />
      <p className="mt-2 text-gray-600" style={{ textAlign: 'center', color: '#B4B4B4' }}>{props.iconFor}</p>
    </div>
  );
}

