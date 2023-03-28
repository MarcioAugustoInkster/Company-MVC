using CompanyProj.Models;
using CompanyProj.Utils;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace CompanyProj.Controllers
{
    public class CompanyController : Controller
    {
        private static Empresa _empresaModel;

        [HttpGet]
        public IActionResult Index()
        {
            ViewData["Title"] = "Cadastro de Empresa";

            /** Dados fixos para testes e manupilação **/
            //_empresaModel = FakeData.LoadModelCompany();
            //_empresaModel.Fornecedores = FakeData.LoadModelSupplier();

            return View(_empresaModel = new Empresa());
        }

        [HttpGet]
        public IActionResult Help()
        {
            ViewData["Title"] = "Manual de Ajuda";
            return View();
        }
        
        [HttpGet]
        public IActionResult About()
        {
            ViewData["Title"] = "Quem eu sou";
            return View();
        }

        [HttpPost]
        public IActionResult Register([FromBody] Empresa empresa)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Alguns dados stão incorretos" });

            if (empresa.Cnpj.Length == 0)
                return Json(new { success = false, message = "Informe um CNPJ" });
            
            if (empresa.NomeFantasia.Length == 0)
                return Json(new { success = false, message = "Informe um Nome Fantasia" });

            _empresaModel = new Empresa()
            {
                NomeFantasia = empresa.NomeFantasia,
                Cnpj = empresa.Cnpj,
                Uf = empresa.Uf
            };

            return Json(new { success = true, result = empresa });
        }
        
        [HttpPost]
        public IActionResult SupplierRegister([FromBody] Fornecedor fornecedor)
        {
            if (!ModelState.IsValid)
                return Json(new { success = false, message = "Alguns dados stão incorretos" });

            if (_empresaModel.Fornecedores != null)
            {
                // add new record
                var dadosFornecedor = new Fornecedor()
                {
                    Empresa = _empresaModel.NomeFantasia,
                    Nome = fornecedor.Nome,
                    CpfCnpj = fornecedor.CpfCnpj,
                    RegistroGeral = fornecedor.RegistroGeral,
                    DataNascimento = fornecedor.DataNascimento,
                    Telefones = new List<string> { fornecedor.Telefone },
                    DataCadastro = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss")
                };
                _empresaModel.Fornecedores.Add(dadosFornecedor);
            }
            else
            {
                // add first record
                _empresaModel.Fornecedores = new List<Fornecedor>()
                {
                    new Fornecedor()
                    {
                        Empresa = fornecedor.Empresa,
                        Nome = fornecedor.Nome,
                        CpfCnpj = fornecedor.CpfCnpj,
                        RegistroGeral = fornecedor.RegistroGeral,
                        DataNascimento = fornecedor.DataNascimento,
                        Telefones = new List<string>
                        {
                            fornecedor.Telefone
                        },
                        DataCadastro = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss")
                    }
                };
            }
            return Json(new { success = true, result = _empresaModel.Fornecedores });
        }

        [HttpPost]
        public IActionResult DataFilter([FromBody] Filter model)
        {
            if (model.Fornecedor?.Length == 0 && model.CpfCnpj?.Length == 0 && model.DataCadastro?.Length == 0)
                return Json(new { success = true, result = _empresaModel.Fornecedores });
            
            List<Fornecedor> filteredItems = new List<Fornecedor>();
            
            if (_empresaModel.Fornecedores != null)
            {
                filteredItems = _empresaModel.Fornecedores.FindAll(x =>
                    x.Nome.ToLower().Contains(model.Fornecedor.ToLower())
                    && x.CpfCnpj.Contains(model.CpfCnpj)
                    && x.DataCadastro.Contains(model.DataCadastro));
            }
            return Json(new { success = true, result = filteredItems });
        }
    }
}
