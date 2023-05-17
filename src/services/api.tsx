export default class Api {

    
    checkToken = async (idToken:string): Promise<string[]> => {
        console.log("start check login:"+idToken);
        fetch('http://209.38.228.176:5000/api/test', {
            method: 'POST',
            body: JSON.stringify({
                idToken:idToken
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
    
    
    callMint = async (idToken:string,privateKey:string,file:File,fileName:string, description:string, name:string): Promise<string[]> => {
      console.log("start check login:"+idToken);
      const formData=new FormData();
      formData.append("file",file);
      formData.append("fileName",fileName);
      formData.append("idToken",idToken);
      formData.append("privateKey",privateKey);
      formData.append("description",description);
      formData.append("name",name);
      fetch('http://209.38.228.176:5000/api/test/mint', {
          method: 'POST',
          body: formData,
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

}