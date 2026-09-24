/**
 * Vérifie que la chaîne complète répond : API, base de données, temps réel.
 *
 * Un hook porte l'appel, l'état de chargement et l'erreur ; le composant ne
 * fait qu'afficher. Modèle à recopier pour chaque écran.
 */

import { useEffect, useState } from 'react';

import { ErreurHttp } from '../api/client';
import { etatSante } from '../api/sante';
import { socket } from '../api/socket';
import type { EtatSante } from '../types/api';

export function useEtatChaine() {
  const [sante, setSante] = useState<EtatSante | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const [tempsReel, setTempsReel] = useState(socket.connected);

  // Chaque incrément relance la vérification. Le bouton modifie ce compteur
  // dans son gestionnaire d'événement ; l'effet, lui, ne touche à l'état
  // qu'à l'arrivée de la réponse — jamais de façon synchrone.
  const [tentative, setTentative] = useState(0);

  useEffect(() => {
    // Ignore une réponse arrivée après une nouvelle tentative ou un démontage.
    let actuelle = true;

    etatSante()
      .then((etat) => {
        if (!actuelle) return;
        setSante(etat);
        setErreur(null);
      })
      .catch((e: unknown) => {
        if (!actuelle) return;
        setSante(null);
        setErreur(e instanceof ErreurHttp ? e.message : 'Erreur inconnue.');
      })
      .finally(() => {
        if (actuelle) setChargement(false);
      });

    return () => {
      actuelle = false;
    };
  }, [tentative]);

  // Le canal temps réel est un système externe : l'effet s'y abonne, et l'état
  // ne change que lorsque le serveur signale une connexion ou une déconnexion.
  useEffect(() => {
    const connecte = () => setTempsReel(true);
    const deconnecte = () => setTempsReel(false);
    socket.on('connect', connecte);
    socket.on('disconnect', deconnecte);
    socket.connect();

    return () => {
      socket.off('connect', connecte);
      socket.off('disconnect', deconnecte);
      socket.disconnect();
    };
  }, []);

  function verifier() {
    setChargement(true);
    setTentative((n) => n + 1);
  }

  return { sante, erreur, chargement, tempsReel, verifier };
}
