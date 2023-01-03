$(document).ready(function () {
    loadGrid();

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


function loadGrid() {
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
                    url: $("#urlPath").val() + "/MBarang/Read",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                create: {
                    url: $("#urlPath").val() + "/MBarang/Create",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                     success: function (response) {
                        swag(response.status, response.remarks);
                        if (response.status == true) {
                            $("#grid").data("kendoGrid").dataSource.read();
                            $("#grid").data("kendoGrid").refresh();
                            }

                        }
                },
                update: {
                    url: $("#urlPath").val() + "/MBarang/Update",
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    success: function (response) {
                        swag(response.status, response.remarks);
                        if (response.status == true) {
                            $("#grid").data("kendoGrid").dataSource.read();
                            $("#grid").data("kendoGrid").refresh();
                        }

                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/MBarang/Delete",
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
                    id: "kode_barang",
                    fields: {
                        kode_barang: { type: "string", sortable: true },
                        nama_barang: { type: "string", sortable: true },
                        pengukuran: { type: "string", sortable: true },
                        stok_barang: { type: "string", sortable: true },
                        harga_barang: { type: "string", sortable: true },
                        jumlah_berat: { type: "string", sortable: true },
                        tgl_msk_gudang: { type: "string", sortable: true },
                        tgl_exp: { type: "string", sortable: true },

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
        toolbar: [
            { name: "create" },
        ],
        excel: {
            fileName: "Coalmine.xlsx",
            allPages: true,
            filterable: true
        },
        columns: [
            {
                title: 'Action', command: ["edit", {
                    name: "Delete", imageClass: "k-delete", iconClass: "k-icon", click: function (e) {  //add a click event listener on the delete button
                        e.preventDefault(); //prevent page scroll reset
                        var tr = $(e.target).closest("tr"); //get the row for deletion
                        var data = this.dataItem(tr); //get the row data so it can be referred later
                        swal({
                            title: "Apakah Anda yakin?",
                            text: "Data Anda akan terhapus!",
                            icon: "warning",
                            buttons: [
                              'Tidak, batalkan!',
                              'Ya, saya yakin!'
                            ],
                            dangerMode: true,
                        }).then(function (isConfirm) {
                            if (isConfirm) {
                                $("#grid").data("kendoGrid").dataSource.remove(data);
                                $("#grid").data("kendoGrid").dataSource.sync();
                            } else {
                                swal("Dibatalkan", "Data Anda aman :)", "error");
                            }
                        });

                    }
                }], width: '130px', attributes: { style: 'text-align: center' }, headerAttributes: { style: 'text-align: center' }
            },
            { field: 'kode_barang', title: 'Kode Barang', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'nama_barang', title: 'Nama Barang', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'pengukuran', title: 'Pengukuran', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'stok_barang', title: 'Stok Barang', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'harga_barang', title: 'Harga Barang', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'jumlah_berat', title: 'jumlah_berat', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'tgl_msk_gudang', title: 'Tanggal Masuk Gudang', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'tgl_exp', title: 'Tanggal Expired', width: '100px', attributes: { style: 'text-align: left' } },


        ],
        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        edit: function (e) {

            if (!e.model.isNew()) {
                disabledField();
            }
           

        },
        dataBound: function (e) {

        }
    });

}

function disabledField() {
    $("input[name='kode_barang']").attr('disabled', true);

}