/** Titre de l'onglet du navigateur : « Page · Agôn Cup ». Aide à se repérer entre plusieurs onglets et dans l'historique. */

import { useEffect } from 'react';

const NOM_DU_SITE = 'Agôn Cup';

export function useTitrePage(titre: string | undefined) {
    useEffect(() => {
        document.title = titre ? `${titre} · ${NOM_DU_SITE}` : NOM_DU_SITE;
    }, [titre]);
}
