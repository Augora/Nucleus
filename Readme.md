# Nucleus
> Nucleus: central part about which other parts are grouped or gathered; core:

## Description

Ce projet a pour but d'agréger les données d'une à plusieurs API pour les stockées dans la solution [Supabase](https://supabase.com/).
Nous utilisons les données des API suivantes :
- [NosDeputes.fr](https://www.nosdeputes.fr/)

Supabase nous permet de redistribuer ces données sous forme d'API.

## Imports sur la base de staging

Pour effectuer un test en local, il faut créer un fichier `.env`, et y copier le contenu de `.env.sample`. Ensuite, il faut renseigner la clef de la base de staging (accessible sur le site de Supabase, dans Settings > API > service_role).

Dans le fichier [index.ts](https://github.com/Augora/Nucleus/blob/develop/src/index.ts), il y a des alias pour chaque tables.

Par exemple, pour effectuer un import sur la table correspondant aux groupes, dont l'alias est "g", il suffit de faire `yarn start -g`.

## Accès aux données

Afin d'accéder à nos données, vous pouvez utiliser notre clef publique Supabase :

`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTgyNDM5OSwiZXhwIjoxOTU3NDAwMzk5fQ.N2JnZEXm3362MXnKoXnPxDZF-STpj6Wn65g2oWcsl7A`

Exemple de requête pour afficher les sigles de la table "groupe parlementaire" : 

```
curl 'https://oyjfimltcpwigbbvotqk.supabase.co/rest/v1/GroupeParlementaire?select=Sigle' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTgyNDM5OSwiZXhwIjoxOTU3NDAwMzk5fQ.N2JnZEXm3362MXnKoXnPxDZF-STpj6Wn65g2oWcsl7A" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTgyNDM5OSwiZXhwIjoxOTU3NDAwMzk5fQ.N2JnZEXm3362MXnKoXnPxDZF-STpj6Wn65g2oWcsl7A"
```

Ci-dessous la liste des tables que nous utilisons :
- Activite
- Depute
- Depute_OrganismeParlementaire
- GroupeParlementaire
- Ministre
- Ministere
- OrganismeParlementaire
