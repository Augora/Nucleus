export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Activite: {
        Row: {
          Id: string
          created_at: string | null
          NumeroDeSemaine: number | null
          DateDeDebut: string | null
          DateDeFin: string | null
          PresencesEnCommission: number | null
          PresenceEnHemicycle: number | null
          MedianeCommission: number | null
          ParticipationsEnCommission: number | null
          MedianeHemicycle: number | null
          ParticipationEnHemicycle: number | null
          MedianeTotal: number | null
          Question: number | null
          Vacances: number | null
          AvantMandat: number | null
          DeputeSlug: string | null
        }
        Insert: {
          Id: string
          created_at?: string | null
          NumeroDeSemaine?: number | null
          DateDeDebut?: string | null
          DateDeFin?: string | null
          PresencesEnCommission?: number | null
          PresenceEnHemicycle?: number | null
          MedianeCommission?: number | null
          ParticipationsEnCommission?: number | null
          MedianeHemicycle?: number | null
          ParticipationEnHemicycle?: number | null
          MedianeTotal?: number | null
          Question?: number | null
          Vacances?: number | null
          AvantMandat?: number | null
          DeputeSlug?: string | null
        }
        Update: {
          Id?: string
          created_at?: string | null
          NumeroDeSemaine?: number | null
          DateDeDebut?: string | null
          DateDeFin?: string | null
          PresencesEnCommission?: number | null
          PresenceEnHemicycle?: number | null
          MedianeCommission?: number | null
          ParticipationsEnCommission?: number | null
          MedianeHemicycle?: number | null
          ParticipationEnHemicycle?: number | null
          MedianeTotal?: number | null
          Question?: number | null
          Vacances?: number | null
          AvantMandat?: number | null
          DeputeSlug?: string | null
        }
      }
      Depute: {
        Row: {
          GroupeParlementaire: string | null
          Age: number | null
          Twitter: string | null
          DebutDuMandat: string | null
          NomCirconscription: string | null
          Slug: string
          Nom: string | null
          created_at: string | null
          Prenom: string | null
          Sexe: string | null
          DateDeNaissance: string | null
          LieuDeNaissance: string | null
          NumeroDepartement: string | null
          NomDepartement: string | null
          NumeroRegion: string | null
          NomRegion: string | null
          NumeroCirconscription: number | null
          DebutMandat: string | null
          RattachementFinancier: string | null
          Profession: string | null
          PlaceEnHemicycle: string | null
          URLAssembleeNationale: string | null
          IDAssembleeNationale: string | null
          NombreMandats: number | null
          EstEnMandat: boolean | null
          URLPhotoAssembleeNationale: string | null
          URLTwitter: string | null
          URLFacebook: string | null
          URLLinkedIn: string | null
          URLInstagram: string | null
          URLPhotoAugora: string | null
          SitesWeb: string[] | null
          Emails: string[] | null
          Collaborateurs: string[] | null
          Suppleant: string | null
          Adresses: Json[] | null
          AutreMandat: Json[] | null
          AncienMandat: Json[] | null
          ResponsabiliteGroupe: Json | null
          URLGouvernement: string | null
        }
        Insert: {
          GroupeParlementaire?: string | null
          Age?: number | null
          Twitter?: string | null
          DebutDuMandat?: string | null
          NomCirconscription?: string | null
          Slug: string
          Nom?: string | null
          created_at?: string | null
          Prenom?: string | null
          Sexe?: string | null
          DateDeNaissance?: string | null
          LieuDeNaissance?: string | null
          NumeroDepartement?: string | null
          NomDepartement?: string | null
          NumeroRegion?: string | null
          NomRegion?: string | null
          NumeroCirconscription?: number | null
          DebutMandat?: string | null
          RattachementFinancier?: string | null
          Profession?: string | null
          PlaceEnHemicycle?: string | null
          URLAssembleeNationale?: string | null
          IDAssembleeNationale?: string | null
          NombreMandats?: number | null
          EstEnMandat?: boolean | null
          URLPhotoAssembleeNationale?: string | null
          URLTwitter?: string | null
          URLFacebook?: string | null
          URLLinkedIn?: string | null
          URLInstagram?: string | null
          URLPhotoAugora?: string | null
          SitesWeb?: string[] | null
          Emails?: string[] | null
          Collaborateurs?: string[] | null
          Suppleant?: string | null
          Adresses?: Json[] | null
          AutreMandat?: Json[] | null
          AncienMandat?: Json[] | null
          ResponsabiliteGroupe?: Json | null
          URLGouvernement?: string | null
        }
        Update: {
          GroupeParlementaire?: string | null
          Age?: number | null
          Twitter?: string | null
          DebutDuMandat?: string | null
          NomCirconscription?: string | null
          Slug?: string
          Nom?: string | null
          created_at?: string | null
          Prenom?: string | null
          Sexe?: string | null
          DateDeNaissance?: string | null
          LieuDeNaissance?: string | null
          NumeroDepartement?: string | null
          NomDepartement?: string | null
          NumeroRegion?: string | null
          NomRegion?: string | null
          NumeroCirconscription?: number | null
          DebutMandat?: string | null
          RattachementFinancier?: string | null
          Profession?: string | null
          PlaceEnHemicycle?: string | null
          URLAssembleeNationale?: string | null
          IDAssembleeNationale?: string | null
          NombreMandats?: number | null
          EstEnMandat?: boolean | null
          URLPhotoAssembleeNationale?: string | null
          URLTwitter?: string | null
          URLFacebook?: string | null
          URLLinkedIn?: string | null
          URLInstagram?: string | null
          URLPhotoAugora?: string | null
          SitesWeb?: string[] | null
          Emails?: string[] | null
          Collaborateurs?: string[] | null
          Suppleant?: string | null
          Adresses?: Json[] | null
          AutreMandat?: Json[] | null
          AncienMandat?: Json[] | null
          ResponsabiliteGroupe?: Json | null
          URLGouvernement?: string | null
        }
      }
      Depute_OrganismeParlementaire: {
        Row: {
          OrganismeSlug: string | null
          Fonction: string | null
          Id: string
          created_at: string | null
          DeputeSlug: string | null
        }
        Insert: {
          OrganismeSlug?: string | null
          Fonction?: string | null
          Id: string
          created_at?: string | null
          DeputeSlug?: string | null
        }
        Update: {
          OrganismeSlug?: string | null
          Fonction?: string | null
          Id?: string
          created_at?: string | null
          DeputeSlug?: string | null
        }
      }
      GroupeParlementaire: {
        Row: {
          DescriptionWikipedia: string | null
          IDWikipedia: string | null
          IDAssembleeNationale: string | null
          Slug: string | null
          Sigle: string | null
          created_at: string | null
          NomComplet: string | null
          Couleur: string | null
          Ordre: number | null
          Actif: boolean | null
          CouleurDetail: Json | null
        }
        Insert: {
          DescriptionWikipedia?: string | null
          IDWikipedia?: string | null
          IDAssembleeNationale?: string | null
          Slug: string | null
          Sigle?: string | null
          created_at?: string | null
          NomComplet?: string | null
          Couleur?: string | null
          Ordre?: number | null
          Actif?: boolean | null
          CouleurDetail?: Json | null
        }
        Update: {
          DescriptionWikipedia?: string | null
          IDWikipedia?: string | null
          IDAssembleeNationale?: string | null
          Slug: string | null
          Sigle?: string | null
          created_at?: string | null
          NomComplet?: string | null
          Couleur?: string | null
          Ordre?: number | null
          Actif?: boolean | null
          CouleurDetail?: Json | null
        }
      }
      Ministere: {
        Row: {
          Slug: string
          Nom: string | null
        }
        Insert: {
          Slug: string
          Nom?: string | null
        }
        Update: {
          Slug?: string
          Nom?: string | null
        }
      }
      Ministre: {
        Row: {
          Slug: string
          Nom: string | null
          Fonction: string | null
          FonctionLong: string | null
          Charge: string | null
          Ministere: string | null
          Prenom: string | null
          NomDeFamille: string | null
        }
        Insert: {
          Slug: string
          Nom?: string | null
          Fonction?: string | null
          FonctionLong?: string | null
          Charge?: string | null
          Ministere?: string | null
          Prenom?: string | null
          NomDeFamille?: string | null
        }
        Update: {
          Slug?: string
          Nom?: string | null
          Fonction?: string | null
          FonctionLong?: string | null
          Charge?: string | null
          Ministere?: string | null
          Prenom?: string | null
          NomDeFamille?: string | null
        }
      }
      OrganismeParlementaire: {
        Row: {
          EstPermanent: boolean | null
          Slug: string
          created_at: string | null
          Nom: string | null
        }
        Insert: {
          EstPermanent?: boolean | null
          Slug: string
          created_at?: string | null
          Nom?: string | null
        }
        Update: {
          EstPermanent?: boolean | null
          Slug?: string
          created_at?: string | null
          Nom?: string | null
        }
      }
      UserRole: {
        Row: {
          id: string
          created_at: string | null
          Role: string | null
          UserId: string | null
        }
        Insert: {
          id: string
          created_at?: string | null
          Role?: string | null
          UserId?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          Role?: string | null
          UserId?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
