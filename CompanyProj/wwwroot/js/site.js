$(function () {
    $('form#formCompany').submit(function (e) {
        e.preventDefault();

        var formData = {
            nomeFantasia: $('#formCompanyName')[0].value,
            cnpj: $('#formCompanyCnpj')[0].value,
            uf: $('#formCompanyUf')[0][parseInt($('#formCompanyUf')[0].value)].text
        };

        $.ajax({
            url: '/Company/Register',
            method: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json; charset=uf8-8',
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.success) {
                    showMessageValidation('');
                    addRowToTable(data.result);
                    addOptionToSelect(formData.nomeFantasia);
                    $('fieldset.upd').has(':disabled').removeAttr('disabled');
                } else {
                    showMessageValidation(data.message);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    });

    $('form#formSupplier').submit(function (e) {
        e.preventDefault();
        var companyType = '';
        if (parseInt($('#formSupplierType')[0].value) === 0) {
            companyType = $('#formSupplierCpf')[0].value;
        } else if (parseInt($('#formSupplierType')[0].value) === 1) {
            companyType = $('#formSupplierCnpj')[0].value;
        }
        var formData = {
            empresa: $('#formSupplierCompany')[0].value,
            nome: $('#formSupplierName')[0].value,
            cpfCnpj: companyType,
            registroGeral: $('#formSupplierRg')[0].value,
            telefone: $('#formSupplierPhone')[0].value,
            dataNascimento: $('#formSupplierBirthDate')[0].value
        };
        var isPessoaFisica = false, isEstado = false, isPessoaValid = false;
        if (parseInt($('#formSupplierType')[0].value) === 0) {
            isPessoaFisica = true;
        }
        if (formData.cpfCnpj?.length === 14 && parseInt($('#formSupplierType')[0].value) === 0) {
            // Pessoa física
            isPessoaValid = true;
        }
        if (parseInt($('#formCompanyUf')[0].value) === 15) {
            // Empresa do Paraná
            isEstado = true;
        }
        var isAboveAge = underAgeValidation(formData.dataNascimento);
        if (isPessoaValid && isEstado && !isAboveAge) {
            showMessageValidation('Fornecedor Pessoa Física do Paraná deve ser Maior de Idade');
            return;
        }
        if (isPessoaFisica) {
            if (formData.registroGeral?.length < 9 && formData.dataNascimento?.length < 10) {
                showMessageValidation('Informe o R.G. e a Data de Nascimento');
                return;
            }
        }
        $.ajax({
            url: '/Company/SupplierRegister',
            method: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json; charset=uf8-8',
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.success) {
                    showMessageValidation('');
                    addSubTable(data.result);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    });

    $('.data-filter').keypress(function (e) {
        var key = e.which;
        if (key === 13) {
            var formData = {
                fornecedor: $('#filterSupplier')[0].value,
                cpfCnpj: $('#filterType')[0].value,
                dataCadastro: $('#filterDatetime')[0].value
            };
            $.ajax({
                url: '/Company/DataFilter',
                data: JSON.stringify(formData),
                method: 'POST',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                cache: false,
                success: function (data) {
                    if (data.success) {
                        $('.table-wrap > table > tbody tr').remove();
                        var apiData = data.result;
                        var strRows = '';
                        if (apiData.length > 0) {
                            for (let i = 0; i < apiData.length; i++) {
                                strRows += '<tr>';
                                strRows += '<td>' + apiData[i].empresa + '</td>';
                                strRows += '<td>' + apiData[i].nome + '</td>';
                                strRows += '<td>' + apiData[i].cpfCnpj + '</td>';
                                strRows += '<td>' + apiData[i].registroGeral + '</td>';
                                strRows += '<td>' + apiData[i].dataNascimento + '</td>';
                                strRows += '<td>' + apiData[i].telefones.map(el => el) + '</td>';
                                strRows += '<td>' + apiData[i].dataCadastro + '</td>';
                                strRows += '<td><button class="btn btn-secondary btn-sm" id="rowdel">x</button></td>';
                                strRows += '</tr>';
                            }
                        } else {
                            strRows = '<tr><td colspan="8" class="text-center">Nenhum Fornecedor encontrado</td></tr>';
                        }
                        $('.table-wrap > table > tbody').append(strRows);
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }
    });

    $('#formSupplierType').on('change', function () {
        if ($('.type-j').attr('hidden')) {
            $('.type-f').attr('hidden', '');
            $('.type-j').removeAttr('hidden');
        } else if ($('.type-f').attr('hidden')) {
            $('.type-j').attr('hidden', '');
            $('.type-f').removeAttr('hidden');
        }
    });

    $(document).on('click', 'button#delaction', function () {
        // get from DOM structure the current append property element
        $(this)[0].parentNode.parentNode.remove();
        // callback
        removeOptionFromSelect();
        // define a set by change property
        var hasAttr = $('fieldset.upd').attr('disabled');
        if (hasAttr === undefined) {
            $('fieldset.upd').attr('disabled', true);
        }
    });

    $(document).on('click', 'button#rowdel', function () {
        var rowsCount = $('.table-wrap > table > tbody tr').length;
        if (rowsCount > 1) {
            // remove the selected TR element only
            $(this)[0].parentElement.parentElement.remove();
        } else {
            // remove all rows, except the first one
            $('.main-table > tbody tr:not(:first-child)').remove();
        }
    });

    function addRowToTable(result) {
        var table = $('table.main-table tbody');
        var strConcat = '';

        // check if table contains some child element
        if (table[0].children.length === 0) {
            strConcat = '<tr><td>' + result.nomeFantasia + '</td>';
            strConcat += '<td>' + result.cnpj + '</td>';
            strConcat += '<td>' + result.uf + '</td>';
            strConcat += '<td><button type="button" id="delaction" class="btn btn-secondary btn-sm">x</button></td></tr>';
            table.append(strConcat);
        }
    }

    function addOptionToSelect(value) {
        var selectCompany = $('#formSupplierCompany');
        // includes the value from input into select element option
        if (selectCompany[0].children.length === 0) {
            selectCompany.append('<option value="' + value + '">' + value + '</option>');
        }
    }

    function removeOptionFromSelect() {
        // clean up all the <options> childs
        $('#formSupplierCompany option').each(function () {
            $(this).remove();
        });
        // also, remove both tables
        $('.table-wrap table').remove();
        $('table.main-table tbody tr').remove();
    }

    function addTbodyRows(result) {
        // table rows structure. Should be dinamically...
        var lastIndex = result.length - 1;

        var strRows = '<tr>';
        strRows += '<td>' + result[lastIndex].empresa + '</td>';
        strRows += '<td>' + result[lastIndex].nome + '</td>';
        strRows += '<td>' + result[lastIndex].cpfCnpj + '</td>';
        strRows += '<td>' + result[lastIndex].registroGeral + '</td>';
        strRows += '<td>' + result[lastIndex].dataNascimento + '</td>';
        strRows += '<td>' + result[lastIndex].telefones.map(el => el) + '</td>';
        strRows += '<td>' + result[lastIndex].dataCadastro + '</td>';
        strRows += '<td><button class="btn btn-secondary btn-sm" id="rowdel">x</button></td>';
        strRows += '</tr>';
        return strRows;
    }

    function addSubTable(result) {
        // check if tbody has remaining rows
        var tbody = $('.table-wrap table').find('tbody');
        var trows = tbody.find('tr');

        // if not, then add the table structure
        if (trows.length === 0) {
            var strConcat = '';
            strConcat += '<tr><td colspan="4"><div class="table-scroll-horiz">';
            strConcat += '<div class="table-wrap"><table><thead>';
            strConcat += '<tr><th scope="col">Empresa</th>';
            strConcat += '<th scope="col">Fornecedor</th>';
            strConcat += '<th scope="col">CPF/CNPJ</th>';
            strConcat += '<th scope="col">RG</th>';
            strConcat += '<th scope="col">Data Nascimento</th>';
            strConcat += '<th scope="col">Telefone</th>';
            strConcat += '<th scope="col">Data Cadastro</th>';
            strConcat += '<th scope="col">Ação</th></tr></thead><tbody>';
            strConcat += '</tbody></table></div></div></td></tr>';
            $('.main-table tbody').append(strConcat);
        }

        // apply append to element
        var strRows = addTbodyRows(result);
        $('.table-wrap table tbody').append(strRows);
    }

    function showMessageValidation(message) {
        if (message?.length > 0) {
            if ($('.statusMessage')[0].innerText.length === 0) {
                $('.statusMessage').append('<span>' + message + '</span>');
            } else {
                $('.statusMessage span')[0].innerText = message;
            }
        } else {
            $('.statusMessage span').remove();
        }
    }

    function underAgeValidation(date) {
        var formatDate = new Date(`${date.substr(3, 2)}/${date.substr(0, 2)}/${date.substr(6, 4)}`);
        var dob = new Date(formatDate);
        var month_diff = Date.now() - dob.getTime();
        var age_dt = new Date(month_diff);
        var year = age_dt.getUTCFullYear();

        if (Math.abs(year - 1970) >= 18) {
            return true;
        }
        return false;
    }
})