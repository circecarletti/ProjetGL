/**
 * Envoie une requête Http de type POST
 * @param {*} url Url du service, inclus le chemin vers l'API
 * @param {*} body Objet contenant les paramètres à envoyer dans 
 *      le corp de la requête, mettre un objet vide {} si pas de paramère
 * @returns Promise avec soit l'erreur (traiter avec "catch"), soit un objet
 *      contenant les données éventuellement retournées (traiter avec "then")
 */
const sendPost = (url, body) => {
    const payload = {
        headers: { 
            "content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(body),
        method: 'POST'
    };

    return fetch(url, payload).
        then( response => {
            // console.log("connexion response : ", response);
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject( { code: response.status, message: response.statusText } );
            }
        });

};

/**
 * 
 * @param {*} url  Url du service, inclus le chemin vers l'API (sans aucun paramètre)
 * @param {*} paramsArray Tableau contenant les paramètres à ajouter. Tableau vide []
 *      si pas de paramètres. Les éléments du tableau DOIVENT être des objet définis comme suit :
 *      {
 *          name: Chaine de caractères représentant le nom du paramètre,
 *          value: Chaine de caractère représentant la valeur du paramètre.
 *      }
 * @returns 
 */
const sendGet = (url, paramsArray) => {
    // console.log("tableau sendGet (httpHelpers) : ", paramsArray);

    let fullUrl = '';
    if (Array.isArray(paramsArray) && paramsArray.length > 0) {
        let paramsString = '?';
        paramsArray.forEach( param => {
            paramsString = paramsString + `${param.name}=${param.value}&`;
            // console.log("param : ", param, "paramsString : ", paramsString)
        });
        fullUrl = url + paramsString.substr(0, paramsString.length - 1);
    } else {
        fullUrl = url;
    }

    const payload = {
        headers: { 
            "content-type": "application/json; charset=UTF-8",
        },
        method: 'GET'
    };

    // console.log("paylod du senGet (httpHelpers) : ",payload);

    return fetch(fullUrl, payload).
        then( response => {
            // console.log("Get response : ", response);
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject( { code: response.status, message: response.statusText } );
            }
        });

}; 

/**
 * Envoie une requête Http de type PUT pour uploader un fichier vers le serveur
 * @param {*} url Url du service, inclus le chemin vers l'API
 * @param {*} formData Objet de type FormData contenant un paramètre "type"
 *      ayant pour valeur "resource" ou "user" et un parametre "image"
 *      contenant les caractéristiques du fichier à uploader
 * @returns Promise avec soit l'erreur (traiter avec "catch"), soit un objet
 *      contenant le path interne où a été stockée l'image (non inclus) 
 *      (traiter avec "then")
 */
const sendFile = (url, formData) => {
    const payload = {
        headers: { 
            "content-type": "multipart/form-data",
        },
        body: formData,
        method: 'PUT'
    };

    return fetch(url, payload).
        then( response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject( { code: response.status, message: response.statusText } );
            }
        });

};


const sendPut = (url, body) => {
    const payload = {
        headers: { 
            "content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(body),
        method: 'PUT'
    };

    return fetch(url, payload).
        then( response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject( { code: response.status, message: response.statusText } );
            }
        });

};


const sendDelete = (url, paramsArray) => {
    // console.log("tableau sendDelete (httpHelpers) : ", paramsArray);

    let fullUrl = '';
    if (Array.isArray(paramsArray) && paramsArray.length > 0) {
        let paramsString = '?';
        paramsArray.forEach( param => {
            paramsString = paramsString + `${param.name}=${param.value}&`;
            // console.log("param : ", param, "paramsString : ", paramsString)
        });
        fullUrl = url + paramsString.substr(0, paramsString.length - 1);
    } else {
        fullUrl = url;
    }

    const payload = {
        headers: { 
            "content-type": "application/json; charset=UTF-8",
        },
        method: 'DELETE'
    };

    // console.log("paylod du senDelete (httpHelpers) : ",payload);

    return fetch(fullUrl, payload).
        then( response => {
            // console.log("Delete response : ", response);
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject( { code: response.status, message: response.statusText } );
            }
        });
};


export {
    sendPost,
    sendGet,
    sendFile,
    sendPut,
    sendDelete
}