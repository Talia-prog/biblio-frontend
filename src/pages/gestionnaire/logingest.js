import React from "react";

function LoginGestionnaire() {
  return (
    <div>
      <h1>Connexion Gestionnaire</h1>
      <form>
        <input type="text" placeholder="Nom d'utilisateur" /><br />
        <input type="password" placeholder="Mot de passe" /><br />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default LoginGestionnaire;