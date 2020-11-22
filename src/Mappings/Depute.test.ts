import { MapAdresse, MapAncienMandat, MapAutreMandat } from './Depute'

describe('MapAdresse function', () => {
  it('should return a standard object', () => {
    const res = MapAdresse(
      'Permanence parlementaire 15 Quai des Deux Emmanuel 06300 Nice Téléphone : 04 92 14 59 00'
    )
    expect(res.AdresseComplete).toBe(
      'Permanence parlementaire 15 Quai des Deux Emmanuel 06300 Nice Téléphone : 04 92 14 59 00'
    )
    expect(res.Adresse).toBe(
      'Permanence parlementaire 15 Quai des Deux Emmanuel 06300 Nice'
    )
    expect(res.CodePostal).toBe('06300')
    expect(res.Telephone).toBe('0492145900')
  })

  it('should return a standard object without Telephone field', () => {
    const res = MapAdresse(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP"
    )
    expect(res.AdresseComplete).toBe(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP"
    )
    expect(res.Adresse).toBe(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP"
    )
    expect(res.CodePostal).toBe('75355')
    expect(res.Telephone).toBeUndefined()
  })

  it('should return a standard object with Telephone field and removed dots', () => {
    const res = MapAdresse(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP Téléphone : 01.40.63.01.59"
    )
    expect(res.AdresseComplete).toBe(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP Téléphone : 01.40.63.01.59"
    )
    expect(res.Adresse).toBe(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP"
    )
    expect(res.CodePostal).toBe('75355')
    expect(res.Telephone).toBe('0140630159')
  })

  it('should return a standard object with Telephone field', () => {
    const res = MapAdresse(
      '18 Rue Gougeard 72000 Le Mans Téléphone : 0243236457'
    )
    expect(res.AdresseComplete).toBe(
      '18 Rue Gougeard 72000 Le Mans Téléphone : 0243236457'
    )
    expect(res.Adresse).toBe('18 Rue Gougeard 72000 Le Mans')
    expect(res.CodePostal).toBe('72000')
    expect(res.Telephone).toBe('0243236457')
  })
})

describe('MapAncienMandat function', () => {
  it.each([
    [
      '20/06/2007 / 19/06/2012 / fin de législature',
      {
        AncienMandatComplet: '20/06/2007 / 19/06/2012 / fin de législature',
        DateDeDebut: '2007-06-20T00:00:00',
        DateDeFin: '2012-06-19T00:00:00',
        Intitule: 'fin de législature',
      },
    ],
    [
      "13/06/1988 / 26/11/1988 / annulation de l'élection sur décision du conseil constitutionnel",
      {
        AncienMandatComplet:
          "13/06/1988 / 26/11/1988 / annulation de l'élection sur décision du conseil constitutionnel",
        DateDeDebut: '1988-06-13T00:00:00',
        DateDeFin: '1988-11-26T00:00:00',
        Intitule:
          "annulation de l'élection sur décision du conseil constitutionnel",
      },
    ],
    [
      '20/06/2012 / 20/06/2017 / fin de législature',
      {
        AncienMandatComplet: '20/06/2012 / 20/06/2017 / fin de législature',
        DateDeDebut: '2012-06-20T00:00:00',
        DateDeFin: '2017-06-20T00:00:00',
        Intitule: 'fin de législature',
      },
    ],
    [
      '19/06/2002 / 19/06/2007 / fin de législature',
      {
        AncienMandatComplet: '19/06/2002 / 19/06/2007 / fin de législature',
        DateDeDebut: '2002-06-19T00:00:00',
        DateDeFin: '2007-06-19T00:00:00',
        Intitule: 'fin de législature',
      },
    ],
    [
      '01/06/1997 / 18/06/2002 / fin de législature',
      {
        AncienMandatComplet: '01/06/1997 / 18/06/2002 / fin de législature',
        DateDeDebut: '1997-06-01T00:00:00',
        DateDeFin: '2002-06-18T00:00:00',
        Intitule: 'fin de législature',
      },
    ],
    [
      '02/04/1993 / 21/04/1997 / fin de législature',
      {
        AncienMandatComplet: '02/04/1993 / 21/04/1997 / fin de législature',
        DateDeDebut: '1993-04-02T00:00:00',
        DateDeFin: '1997-04-21T00:00:00',
        Intitule: 'fin de législature',
      },
    ],
    [
      '21/06/2017 / / ',
      {
        AncienMandatComplet: '21/06/2017 / / ',
        DateDeDebut: '2017-06-21T00:00:00',
        DateDeFin: undefined,
        Intitule: undefined,
      },
    ],
  ])('MapAncienMandat("%s")', (input, expected) => {
    const mappedMandat = MapAncienMandat(input)
    expect(mappedMandat).toStrictEqual(expected)
  })
})

describe('MapAutreMandat function', () => {
  it.each([
    [
      'Marseille Provence Métropole / Communauté urbaine / membre',
      {
        AutreMandatComplet:
          'Marseille Provence Métropole / Communauté urbaine / membre',
        Institution: 'Communauté urbaine',
        Intitule: 'membre',
        Localite: 'Marseille Provence Métropole',
      },
    ],
    [
      "Pays-d'Aix-en-Provence / Communauté d'agglomération / membre",
      {
        AutreMandatComplet:
          "Pays-d'Aix-en-Provence / Communauté d'agglomération / membre",
        Institution: "Communauté d'agglomération",
        Intitule: 'membre',
        Localite: "Pays-d'Aix-en-Provence",
      },
    ],
    [
      'Marseille / Conseil municipal / membre',
      {
        AutreMandatComplet: 'Marseille / Conseil municipal / membre',
        Institution: 'Conseil municipal',
        Intitule: 'membre',
        Localite: 'Marseille',
      },
    ],
  ])('MapAutreMandat("%s")', (input, expected) => {
    const mappedMandat = MapAutreMandat(input)
    expect(mappedMandat).toStrictEqual(expected)
  })
})
