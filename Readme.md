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