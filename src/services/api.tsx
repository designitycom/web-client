import { nanoid } from "nanoid";

export default class Api {


   checkToken = async (idToken: string): Promise<string[]> => {
      console.log("start check login:" + idToken);
      fetch('http://209.38.228.176:5000/api/test', {
         method: 'POST',
         body: JSON.stringify({
            idToken: idToken
            // Add parameters here
         }),
         headers: {
            'Content-type': 'application/json; charset=UTF-8',
         },
      })
         .then((response) => response.json())
         .then((data) => {
            console.log(data);
            // Handle data
         })
         .catch((err) => {
            console.log(err.message);
         });
      return ["ok"];
   }

   getAllNft = async (idToken: string, privateKey: string): Promise<string[]> => {
      console.log("start check login:" + idToken);
      const formData = new FormData();
      formData.append("idToken", idToken);
      formData.append("privateKey", privateKey);
      fetch('http://209.38.228.176:5000/api/test/getAllNft', {
         method: 'POST',
         body: formData
      })
         .then((response) => response.json())
         .then((data) => {
            console.log(data);
            // Handle data
         })
         .catch((err) => {
            console.log(err.message);
         });
      return ["ok"];
   }

   callMint = async (idToken: string, privateKey: string, file: File, fileName: string, description: string, name: string, callBack: (data: JSON) => {}): Promise<string[]> => {
      console.log("start check login:" + idToken);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("idToken", idToken);
      formData.append("privateKey", privateKey);
      formData.append("description", description);
      formData.append("name", name);
      formData.append("workId", nanoid())
      fetch('http://209.38.228.176:5000/api/test/mint', {
         method: 'POST',
         body: formData,
      })
         .then((response) => response.json())
         .then((data) => {
            console.log(data.explorer_uri);
            callBack(data);
            // Handle data
         })
         .catch((err) => {
            console.log(err.message);
         });
      return ["ok"];
   }
   callUpdateMint = async (idToken: string, privateKey: string, file: File, fileName: string, description: string, name: string, mintAddress: string, callBack: (data: JSON) => {}): Promise<string[]> => {
      console.log("start check login:" + mintAddress);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("idToken", idToken);
      formData.append("privateKey", privateKey);
      formData.append("description", description + "_updated");
      formData.append("name", name + "_updated");
      formData.append("mintAddress", mintAddress);
      fetch('http://209.38.228.176:5000/api/test/updateMint', {
         method: 'POST',
         body: formData,
      })
         .then((response) => response.json())
         .then((data) => {
            console.log(data.explorer_uri);
            callBack(data);
            // Handle data
         })
         .catch((err) => {
            console.log(err.message);
         });
      return ["ok"];
   }

}