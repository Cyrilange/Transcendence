/*const axios = require('axios');

// Requêter un utilisateur avec un ID donné.
axios.get('/user?ID=12345')
  .then(function (response) {
    // en cas de réussite de la requête
    console.log(response);
  })
  .catch(function (error) {
    // en cas d’échec de la requête
    console.log(error);
  })
  .finally(function () {
    // dans tous les cas
  });

// la requête ci-dessus pourrait aussi être faite comme ceci :
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // dans tous les cas
  });  

// vous souhaitez utiliser async/await ?
// ajoutez le mot-clé `async` à la fonction/méthode englobante
async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
*/ 