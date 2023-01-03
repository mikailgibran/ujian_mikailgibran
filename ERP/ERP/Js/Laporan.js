$(document).ready(function () {
    initializeParameter();

});

function swag(type, remarks) {
    var head, body, ops;
    if (type == true) {
        head = "Good job!";
        ops = "success";
        swal(head, remarks, ops);
    } else {
        head = "Oops...";
        ops = "error";
        setTimeout(function () {
            swal(head, remarks, ops);
        }, 300);
    }
}


function loadGrid(periode) {
    if ($("#grid").data().kendoGrid != null) {
        $("#grid").data().kendoGrid.destroy();
        $("#grid").empty();


    }
    $("#grid").kendoGrid({
        dataSource: {
            type: "json",
            error: function (e) {
                if (e.errors == true) {
                    var grid_error = $("#grid").data("kendoGrid");
                    grid_error.one("dataBinding", function (e) {
                        e.preventDefault();
                    })
                }
            },
            requestEnd: function (e) {
                if (e.type == "destroy" && e.response.status == false) {
                    this.cancelChanges();
                }
                if ((e.type == "create" || e.type == "update") && e.response.status == true) {
                    $("#grid").data("kendoGrid").dataSource.read();
                }
            },
            transport: {
                read: {
                    url: $("#urlPath").val() + "/Laporan/Read?periode="+periode,
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation) {
                    return kendo.stringify(data);
                }
            },

            pageSize: 15,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: true,
            schema: {
                errors: function (response) {
                    if (response.status == false) {
                        swag(response.status, response.remarks);
                        return true;
                    } else if (response.status == true) {
                        swag(response.status, response.remarks)
                    }
                    return false;
                },
                data: "Data",
                total: "Total",
                batch: true,
                model: {
                    id: "periode",
                    fields: {
                        periode: { type: "string", sortable: true },
                        pemasukan: { type: "string", sortable: true },
                        pembelian: { type: "string", sortable: true },


                    }
                }
            }
        },
        height: 450,
        editable: true,
        editable: "inline",
        resizable: true,
        sortable: true,
        filterable: true,
        pageable: {
            refresh: true,
            buttonCount: 10,
            input: true,
            info: true
        },
       
        columns: [
            { field: 'periode', title: 'Periode', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'pemasukan', title: 'Pemasukan', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'pembelian', title: 'Pengeluaran', width: '100px', attributes: { style: 'text-align: left' } },

        ],
        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        dataBound: function (e) {

        }
    });

}

function initializeParameter() {

    $("#txt_periode").kendoDatePicker({
        // defines the start view
        start: "year",

        // defines when the calendar should return date
        depth: "year",

        // display month and year in the input
        format: "MMMM yyyy",

        //set min value januari 2022, 0 disini terhitung januari
        min: new Date(2022, 0, 1),

        // specifies that DateInput is used for masking the input element
        dateInput: true
    });
}

var iyear, imonth, periode;

$("#btn_view").click(function () {

    if ($("#txt_periode").data("kendoDatePicker").value() == null) {
        swag(false, "Periode Harus Dipilih");
    }
    else {

        iyear = kendo.toString($("#txt_periode").data("kendoDatePicker").value(), "yyyy");
        imonth = kendo.toString($("#txt_periode").data("kendoDatePicker").value(), "MM");
        periode = iyear + imonth;

        console.log(periode)
        loadGrid(periode);


    }



});