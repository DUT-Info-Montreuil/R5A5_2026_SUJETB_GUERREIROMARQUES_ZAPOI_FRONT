/**
 * Vérifie que la chaîne complète répond : API, base de données, temps réel.
 *
 * Un hook porte l'appel, l'état de chargement et l'erreur ; le composant ne
 * fait qu'afficher. Modèle à recopier pour chaque écran.
 */

import { useEffect, useState } from 'react';

import { ErreurHttp } from '../api/client';
import { etatSante } from '../api/sante';
import { URL_API } from '../api/client';
import { socket } from '../api/socket';
import type { EtatSante } from '../types/api';

export function useEtatChaine() {
  const [sante, setSante] = useState<EtatSante | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const [tempsReel, setTempsReel] = useState(socket.connected);
  // Pourquoi le temps réel ne répond pas, et par quel transport il passe quand il répond :
  // c'est ce qu'un étudiant ou un correcteur doit pouvoir lire à l'écran.
  const [erreurTempsReel, setErreurTempsReel] = useState<string | null>(null);
  const [transport, setTransport] = useState<string | null>(null);

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
    const connecte = () => {
      setTempsReel(true);
      setErreurTempsReel(null);
      setTransport(socket.io?.engine?.transport?.name ?? null);
      // Socket.IO démarre en polling puis passe en WebSocket : on suit le changement.
      socket.io?.engine?.once('upgrade', (t: { name: string }) => setTransport(t.name));
    };
    const deconnecte = () => setTempsReel(false);
    const enErreur = (e: Error) => setErreurTempsReel(e.message);
    socket.on('connect', connecte);
    socket.on('disconnect', deconnecte);
    socket.on('connect_error', enErreur);
    socket.connect();

    return () => {
      socket.off('connect', connecte);
      socket.off('disconnect', deconnecte);
      socket.off('connect_error', enErreur);
      socket.disconnect();
    };
  }, []);

  function verifier() {
    setChargement(true);
    setTentative((n) => n + 1);
  }

  // L'adresse que le navigateur tente d'atteindre : vide = celle de la page (image Docker).
  const adresse = URL_API || window.location.origin;

  return { sante, erreur, chargement, tempsReel, erreurTempsReel, transport, adresse, verifier };
}
