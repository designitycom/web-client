import { nanoid } from "nanoid";


const serverAddress:string=process.env.REACT_APP_SERVER_ADDRESS!;


   export async function checkToken(idToken: string): Promise<string[]>  {
      console.log("start check login:" + idToken);
      fetch(serverAddress+'/api/test', {
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
   export async function getAllNft(idToken: string, privateKey: string,callBack:Function): Promise<string[]>  {
      console.log("start check login:" + idToken);
      const formData = new FormData();
      formData.append("idToken", idToken);
      formData.append("privateKey", privateKey);
      fetch(serverAddress+'/api/test/findAllMintWithCollection', {
         method: 'POST',
         body: formData
      })
         .then((response) => response.json())
         .then((data) => {
            console.log(data);
            console.log(typeof(data))
            callBack(data);
            // Handle data
         })
         .catch((err) => {
            console.log(err.message);
         });
      return ["ok"];
   }
   export async function callMint(idToken: string, privateKey: string, file: File, fileName: string, description: string, name: string,collectionMint: string, callBack: (data: JSON) => {}): Promise<string[]>  {
      console.log("start check login:" + idToken);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("idToken", idToken);
      formData.append("privateKey", privateKey);
      formData.append("description", description);
      formData.append("name", name);
      formData.append("collectionMint", collectionMint);
      formData.append("workId", nanoid())
      fetch(serverAddress+'/api/test/mint', {
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
   export async function callDefaultMint(idToken: string, privateKey: string, description: string, name: string,role: string, callBack: (data: JSON) => {}): Promise<string[]>  {
      console.log("start check login:" + idToken);
      const formData = new FormData();
      formData.append("idToken", idToken);
      formData.append("privateKey", privateKey);
      formData.append("description", description);
      formData.append("name", name);
      formData.append("role", role);
      formData.append("workId", nanoid())
      fetch(serverAddress+'/api/test/defaultMint', {
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
   export async function callMintCollection(idToken: string, privateKey: string, file: File, fileName: string, description: string, name: string,collectionMint: string, callBack: (data: JSON) => {}): Promise<string[]> {
      console.log("start check login:" + idToken);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("idToken", idToken);
      formData.append("privateKey", privateKey);
      formData.append("description", description);
      formData.append("name", name);
      formData.append("collectionMint", collectionMint);
      formData.append("workId", nanoid())
      fetch(serverAddress+'/api/test/mintCollection', {
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
   export async function callUpdateMint(idToken: string, privateKey: string, file: File, fileName: string, description: string, name: string, mintAddress: string, callBack: (data: JSON) => {}): Promise<string[]> {
      console.log("start check login:" + mintAddress);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("idToken", idToken);
      formData.append("privateKey", privateKey);
      formData.append("description", description + "_updated");
      formData.append("name", name + "_updated");
      formData.append("mintAddress", mintAddress);
      fetch(serverAddress+'/api/test/updateMint', {
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
   export async function checkingEmail(email: string, callBack: (data: string,role: string) => {}): Promise<string[]> {
      console.log("email:" + email);
      const formData = new FormData();
      formData.append("email", email);
      fetch(serverAddress+'/api/test/checkingEmail', {
         method: 'POST',
         body: formData,
      })
         .then((response) => response.json())
         .then((data) => {
            console.log(data.data);
            if(data.data){
               callBack(data.data.Name,data.data.Role);
            }else{
               callBack("guest user","guest");
            }
            // Handle data
         })
         .catch((err) => {
            console.log(err.message);
         });
      return ["ok"];
   }

