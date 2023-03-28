using CompanyProj.Models;
using System.Collections.Generic;

namespace CompanyProj.Utils
{
    public class FakeData
    {
        public static Empresa LoadModelCompany()
        {
            return new Empresa()
            {
                NomeFantasia = "Marmita do Chinês",
                Cnpj = "23.923.091/0001-02",
                Uf = "RJ"
            };
        }
        public static List<Fornecedor> LoadModelSupplier()
        {
            return new List<Fornecedor>()
            {
                new Fornecedor()
                {
                    Empresa = LoadModelCompany().NomeFantasia,
                    Nome = "Transportes São Miguel",
                    CpfCnpj = "210.968.712-75",
                    DataCadastro = "21/03/2023 14:37:12",
                    RegistroGeral = "8.241.006",
                    DataNascimento = "19/08/2005",
                    Telefones = new List<string>()
                    {
                        "(27) 9123-5871"
                    }
                },
                new Fornecedor()
                {
                    Empresa = LoadModelCompany().NomeFantasia,
                    Nome = "Solene Contabilidade",
                    CpfCnpj = "32.095.498/0007-54",
                    DataCadastro = "13/01/2023 11:22:43",
                    RegistroGeral = "",
                    DataNascimento = "",
                    Telefones = new List<string>()
                    {
                        "(32) 2213-3212"
                    }
                },
                new Fornecedor()
                {
                    Empresa = LoadModelCompany().NomeFantasia,
                    Nome = "Prestius Assistência",
                    CpfCnpj = "54.091.220/0002-03",
                    DataCadastro = "06/05/2022 16:18:37",
                    RegistroGeral = "",
                    DataNascimento = "",
                    Telefones = new List<string>()
                    {
                        "(38) 3300-3011"
                    }
                }
            };
        }
    }
}
