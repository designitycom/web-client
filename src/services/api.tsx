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

}