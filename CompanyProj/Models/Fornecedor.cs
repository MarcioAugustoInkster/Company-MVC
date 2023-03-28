using System;
using System.Collections.Generic;

namespace CompanyProj.Models
{
    public class Fornecedor
    {
        public string Empresa { get; set; }
        public string Nome { get; set; }
        public string CpfCnpj { get; set; }
        public string RegistroGeral { get; set; }
        public string DataCadastro { set; get; }
        public string Telefone { get; set; }
        public string DataNascimento { get; set; }
        public List<string> Telefones { get; set; }
    }
}
