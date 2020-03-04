import { MapAdresse } from "./Depute";

describe("MapAdresse function", () => {
  it("should return a standard object", () => {
    const res = MapAdresse(
      "Permanence parlementaire 15 Quai des Deux Emmanuel 06300 Nice Téléphone : 04 92 14 59 00"
    );
    expect(res.AdresseComplete).toBe(
      "Permanence parlementaire 15 Quai des Deux Emmanuel 06300 Nice Téléphone : 04 92 14 59 00"
    );
    expect(res.Adresse).toBe(
      "Permanence parlementaire 15 Quai des Deux Emmanuel 06300 Nice"
    );
    expect(res.CodePostal).toBe("06300");
    expect(res.Telephone).toBe("0492145900");
  });

  it("should return a standard object without Telephone field", () => {
    const res = MapAdresse(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP"
    );
    expect(res.AdresseComplete).toBe(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP"
    );
    expect(res.Adresse).toBe(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP"
    );
    expect(res.CodePostal).toBe("75355");
    expect(res.Telephone).toBeUndefined();
  });

  it("should return a standard object with Telephone field and removed dots", () => {
    const res = MapAdresse(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP Téléphone : 01.40.63.01.59"
    );
    expect(res.AdresseComplete).toBe(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP Téléphone : 01.40.63.01.59"
    );
    expect(res.Adresse).toBe(
      "Assemblée nationale, 126 Rue de l'Université, 75355 Paris 07 SP"
    );
    expect(res.CodePostal).toBe("75355");
    expect(res.Telephone).toBe("0140630159");
  });

  it("should return a standard object with Telephone field", () => {
    const res = MapAdresse(
      "18 Rue Gougeard 72000 Le Mans Téléphone : 0243236457"
    );
    expect(res.AdresseComplete).toBe(
      "18 Rue Gougeard 72000 Le Mans Téléphone : 0243236457"
    );
    expect(res.Adresse).toBe("18 Rue Gougeard 72000 Le Mans");
    expect(res.CodePostal).toBe("72000");
    expect(res.Telephone).toBe("0243236457");
  });
});
