window_penjualan = $("#window_penjualan").kendoWindow({
    modal: true,
    width: 1200,
    height: 750,
    visible: false,
    draggable: true,
    scrollable: true,
    //close: function () {
    //},
    open: function (e) {

    }
}).data("kendoWindow").center();

$(document).ready(function () {
    $("#Tabs").kendoTabStrip({
        animation: {
            open: {
                duration: 100,
                effects: "expand:vertical"
            }
        }
    });
    loadGridPembelian();
    loadGridPenjualan();
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

//-------------------------------------------------------------Start pembelian-----------------------------------------\\

function loadGridPembelian() {
    if ($("#grid_pembelian").data().kendoGrid != null) {
        $("#grid_pembelian").data().kendoGrid.destroy();
        $("#grid_pembelian").empty();


    }
    $("#grid_pembelian").kendoGrid({
        dataSource: {
            type: "json",
            error: function (e) {
                if (e.errors == true) {
                    var grid_error = $("#grid_pembelian").data("kendoGrid");
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
                    $("#grid_pembelian").data("kendoGrid").dataSource.read();
                }
            },
            transport: {
                read: {
                    url: $("#urlPath").val() + "/Transaksi/ReadPembelian",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                destroy: {
                    url: $("#urlPath").val() + "/Transaksi/DeletePembelian",
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
                    id: "pid",
                    fields: {
                        pid: { type: "string", sortable: true },
                        tanggal_transaksi: { type: "date", sortable: true },
                        kode_barang: { type: "string", sortable: true },
                        nama_barang: { type: "string", sortable: true },
                        pengukuran: { type: "string", sortable: true },
                        jumlah_pembelian: { type: "number", sortable: true },
                        harga: { type: "number", sortable: true },
                        total: { type: "number", sortable: true },


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
         { template : '<button type="button" id="btn_add" class="k-button k-button-icontext" onclick="CreatePembelian()"><span class="glyphicon glyphicon-plus"></span> Add New Record</button>'} ,
        ],
        columns: [
            {
                title: 'Action', command: [{ text: "Edit", click: UpdatePembelian, iconClass: "glyphicon glyphicon-edit spasi-kanan" }, {
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
                                $("#grid_pembelian").data("kendoGrid").dataSource.remove(data);
                                $("#grid_pembelian").data("kendoGrid").dataSource.sync();
                            } else {
                                swal("Dibatalkan", "Data Anda aman :)", "error");
                            }
                        });

                    }
                }], width: '130px', attributes: { style: 'text-align: center' }, headerAttributes: { style: 'text-align: center' }
            },
            { field: 'tanggal_transaksi', title: 'Tanggal Transaksi', width: '100px', attributes: { style: 'text-align: left' }, template: "#=tanggal_transaksi==null?'': kendo.toString(kendo.parseDate(tanggal_transaksi, 'yyyy-MM-dd'), 'dd/MM/yyyy') #" },
            { field: 'kode_barang', title: 'Kode Barang', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'nama_barang', title: 'Nama Barang', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'pengukuran', title: 'Pengukuran', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'jumlah_pembelian', title: 'Jumlah Pembelian', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'harga', title: 'Harga', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'total', title: 'Total', width: '100px', attributes: { style: 'text-align: left' } },


        ],
        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        dataBound: function (e) {

        }
    });

}

$("#txt_tanggal_transaksi").kendoDatePicker({
    format: "dd/MM/yyyy",
});

$("#txt_jumlah_pembelian").on("change keyup", function (e) {
    e.preventDefault();
    calculateTotalPembelian();
})
$("#txt_harga").on("change keyup", function (e) {
    e.preventDefault();
    calculateTotalPembelian();
})

function calculateTotalPembelian() {
    var jumlah_pembelian = $("#txt_jumlah_pembelian").val();
    var harga = $("#txt_harga").val();
    $("#txt_total").val(jumlah_pembelian * harga);

}

function CreatePembelian() {

    $("#title_trans_pembelian").text("Add Riwayat Pembelian Baru");
    clearFieldPembelian();

    $('#myModalPembelian').modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });
    save_method = "create";
}

function UpdatePembelian(e) {
    $("#title_trans_pembelian").text("Edit Riwayat Pembelian FL");


    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

    $("#txt_pid").val(dataItem.pid);
    $("#txt_tanggal_transaksi").data("kendoDatePicker").value(dataItem.tanggal_transaksi);
    $("#txt_kode_barang").val(dataItem.kode_barang);
    $("#txt_nama_barang").val(dataItem.nama_barang);
    $("#txt_pengukuran").val(dataItem.pengukuran);
    $("#txt_jumlah_pembelian").val(dataItem.jumlah_pembelian);
    $("#txt_harga").val(dataItem.harga);
    $("#txt_total").val(dataItem.total);

    save_method= "update";
    $('#myModalPembelian').modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });
}


function clearFieldPembelian() {
    $("#txt_pid").val("");
    $("#txt_tanggal_transaksi").val("");
    $("#txt_kode_barang").val("");
    $("#txt_nama_barang").val("");
    $("#txt_pengukuran").val("");
    $("#txt_jumlah_pembelian").val("");
    $("#txt_harga").val("");
    $("#txt_total").val("");

}
$("#btn_SimpanPembelian").click(function () {

    url_ = "";
    if(save_method == "create"){
        url_ = $("#urlPath").val() + "/Transaksi/CreatePembelian";
    }
    else {
        url_ = $("#urlPath").val() + "/Transaksi/UpdatePembelian";
    }
    var stbl = {
        pid: $("#txt_pid").val(),
        tanggal_transaksi: $("#txt_tanggal_transaksi").data("kendoDatePicker").value(),
        kode_barang: $("#txt_kode_barang").val(),
        nama_barang: $("#txt_nama_barang").val(),
        pengukuran: $("#txt_pengukuran").val(),
        jumlah_pembelian: $("#txt_jumlah_pembelian").val(),
        harga: $("#txt_harga").val(),
        total: $("#txt_total").val(),
        
    }

    console.log(stbl);
    // if (confirm('Apakah Data yang Anda Isi Sudah Benar?')) {

    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: url_,
        data: JSON.stringify(stbl),
        success: function (response) {
            console.log(response);
            swag(response.status, response.remarks);
            if (response.status == true) {
                $('#myModalPembelian').modal('toggle');
                $("#grid_pembelian").data("kendoGrid").dataSource.read();
                $("#grid_pembelian").data("kendoGrid").refresh();
            }

        }
    });

    //}

});

$("#btn_BatalPembelian").click(function () {
    $('#myModalPembelian').modal('toggle');

});
//-------------------------------------------------------------End pembelian-----------------------------------------\\


//-------------------------------------------------------------Start penjualan-----------------------------------------\\

function loadGridPenjualan() {
    if ($("#grid_penjualan").data().kendoGrid != null) {
        $("#grid_penjualan").data().kendoGrid.destroy();
        $("#grid_penjualan").empty();


    }
    $("#grid_penjualan").kendoGrid({
        dataSource: {
            type: "json",
            error: function (e) {
                if (e.errors == true) {
                    var grid_error = $("#grid_penjualan").data("kendoGrid");
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
                    $("#grid_penjualan").data("kendoGrid").dataSource.read();
                }
            },
            transport: {
                read: {
                    url: $("#urlPath").val() + "/Transaksi/ReadPenjualan",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                destroy: {
                    url: $("#urlPath").val() + "/Transaksi/DeletePenjualan",
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
                    id: "no_transaksi",
                    fields: {
                        no_transaksi: { type: "string", sortable: true },
                        tanggal_transaksi: { type: "date", sortable: true },
                        total: { type: "number", sortable: true },


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
         { template: '<button type="button" id="btn_add" class="k-button k-button-icontext" onclick="CreatePenjualan()"><span class="glyphicon glyphicon-plus"></span> Add New Record</button>' },
        ],
        
        columns: [
            {
                title: 'Action', command: [{ text: "Detail", click: DetailPenjualan, iconClass: "glyphicon glyphicon-edit spasi-kanan" }, {
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
                                $("#grid_penjualan").data("kendoGrid").dataSource.remove(data);
                                $("#grid_penjualan").data("kendoGrid").dataSource.sync();
                            } else {
                                swal("Dibatalkan", "Data Anda aman :)", "error");
                            }
                        });

                    }
                }], width: '130px', attributes: { style: 'text-align: center' }, headerAttributes: { style: 'text-align: center' }
            },
            { field: 'no_transaksi', title: 'No. Transaksi', width: '100px', attributes: { style: 'text-align: left' } },
            { field: 'tanggal_transaksi', title: 'Tanggal Transaksi', width: '100px', attributes: { style: 'text-align: left' }, template: "#=tanggal_transaksi==null?'': kendo.toString(kendo.parseDate(tanggal_transaksi, 'yyyy-MM-dd'), 'dd/MM/yyyy') #" },
            { field: 'total', title: 'Total', width: '100px', attributes: { style: 'text-align: left' } },


        ],
        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        dataBound: function (e) {

        }
    });

}

$("#txt_tanggal_trans_jual").kendoDatePicker({
    format: "dd/MM/yyyy",
});

var no_transaksi_jual;

function getGenerateNoTransaksi() {

    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: $("#urlPath").val() + "/Transaksi/GenerateNoTransaksi",
        success: function (response) {
            console.log(response)
            $("#txt_no_trans_jual").val(response);
            $("#txt_no_trans_jual").change();
            var no_transaksi_jual = response;

            loadGridAddItemPenjualan(no_transaksi_jual);

        }
    });

}

function CreatePenjualan() {
    is_show_action_itempenjualan = true;
    //$("#title_trans_penjualan").text("Add Riwayat Penjualan Baru");
    clearFieldPenjualan();

    //$('#myModalPenjualan').modal({
    //    show: true,
    //    keyboard: false,
    //    backdrop: 'static'
    //});

     window_penjualan.center().open();

    save_method = "create";

    getGenerateNoTransaksi();
    
}

function clearFieldPenjualan() {
    $("#txt_no_trans_jual").val("");
    $("#txt_tanggal_trans_jual").data("kendoDatePicker").value("");
}

var is_show_action_itempenjualan = true;


function DetailPenjualan(e) {
    window_penjualan.center().open();


    e.preventDefault();
    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

    $("#txt_no_trans_jual").val(dataItem.no_transaksi);
    $("#txt_tanggal_trans_jual").data("kendoDatePicker").value(dataItem.tanggal_transaksi);
    //$("#txt_total_jual").val(dataItem.total);

    is_show_action_itempenjualan = false;

    no_transaksi_jual = dataItem.no_transaksi;
    loadGridAddItemPenjualan(no_transaksi_jual);

    $("#btn_SimpanPenjualan").hide();
    $("#btn_BatalPenjualan").hide();

}


function clearFieldPenjualan() {
    $("#txt_no_trans_jual").val("");
    $("#txt_tanggal_trans_jual").val("");
   // $("#txt_total_jual").val("");

}
$("#btn_SimpanPenjualan").click(function () {

    url_ = "";
    if (save_method == "create") {
        url_ = $("#urlPath").val() + "/Transaksi/CreatePenjualan";
    }
    else {
        url_ = $("#urlPath").val() + "/Transaksi/UpdatePenjualan";
    }
    var stbl = {
        no_transaksi: $("#txt_no_trans_jual").val(),
        tanggal_transaksi: $("#txt_tanggal_trans_jual").data("kendoDatePicker").value()
        //total: $("#txt_total_jual").val(),

    }

    console.log(stbl);
    // if (confirm('Apakah Data yang Anda Isi Sudah Benar?')) {

    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: url_,
        data: JSON.stringify(stbl),
        success: function (response) {
            console.log(response);
            alert(response.remarks);
            if (response.status == true) {
                window_penjualan.close();
                $("#grid_penjualan").data("kendoGrid").dataSource.read();
                $("#grid_penjualan").data("kendoGrid").refresh();
            }

        }
    });

    //}

});

$("#btn_BatalPenjualan").click(function () {

    var stbl = {
        no_transaksi: $("#txt_no_trans_jual").val(),
    }

    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: $("#urlPath").val() + "/Transaksi/DeletePenjualan",
        data: JSON.stringify(stbl),
        success: function (response) {
            window_penjualan.close();

        }
    });

   
});
//-------------------------------------------------------------End penjualan-----------------------------------------\\

//------------------------------------------------------------Start Add Item Penjualan---------------------------------------\\

function loadGridAddItemPenjualan(no_transaksi_jual) {
    if ($("#grid_itempenjualan").data().kendoGrid != null) {
        $("#grid_itempenjualan").data().kendoGrid.destroy();
        $("#grid_itempenjualan").empty();


    }
    $("#grid_itempenjualan").kendoGrid({
        dataSource: {
            type: "json",
            error: function (e) {
                if (e.errors == true) {
                    var grid_error = $("#grid_itempenjualan").data("kendoGrid");
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
                    $("#grid_itempenjualan").data("kendoGrid").dataSource.read();
                }
            },
            transport: {
                read: {
                    url: $("#urlPath").val() + "/Transaksi/ReadItemPenjualan?no_transaksi=" + no_transaksi_jual,
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                create: {
                    url: $("#urlPath").val() + "/Transaksi/CreateItemPenjualan" ,
                    contentType: "application/json",
                    type: "POST",
                    cache: false,
                    complete: function (response) {
                        var i_obj_grid = $("#grid_itempenjualan").data("kendoGrid");
                        i_obj_grid.dataSource.read();
                    }
                },
                destroy: {
                    url: $("#urlPath").val() + "/Transaksi/DeleteItemPenjualan",
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                },
                parameterMap: function (data, operation) {
                    if (operation == "create" || operation == "update") {
                        data.no_transaksi = $("#txt_no_trans_jual").val();
                    }
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
                        alert(response.remarks);
                        //swag(response.status, response.remarks);
                        return true;
                    } else if (response.status == true) {
                        //swag(response.status, response.remarks)
                        alert(response.remarks);
                    }
                    return false;
                },
                data: "Data",
                total: "Total",
                batch: true,
                model: {
                    id: "pid",
                    fields: {
                        no_transaksi: { type: "string", sortable: true },
                        kode_barang: { type: "string", sortable: true },
                        nama_barang: { type: "string", sortable: true },
                        jumlah: { type: "number", sortable: true },
                        harga_satuan: { type: "number", sortable: true },
                        harga_total: { type: "string", sortable: true },


                    }
                }
            },
            //aggregate: [
            //   { field: "harga_total", aggregate: "sum" },
            //   ],
        },
        height: 400,
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
         { name: "create", text: "ADD NEW" },

        ],
        edit: function (e) {
            $("input[name='harga_total']").attr('disabled', true);
        },

        columns: [
            {
                field: "coms",
                title: 'Action', command: [{ name: "edit", text: "EDIT" }, { name: "destroy", text: "DEL" }
                    ], width: '130px', attributes: { style: 'text-align: center' }, headerAttributes: { style: 'text-align: center' }
            },
            { field: 'kode_barang', title: 'Kode Barang', width: "auto", attributes: { style: 'text-align: left' } },
            { field: 'nama_barang', title: 'Nama Barang', width: "auto", attributes: { style: 'text-align: left' } },
            { field: 'jumlah', title: 'Jumlah', width: "auto", attributes: { style: 'text-align: left' }, editor: jumlahEditor },
            { field: 'harga_satuan', title: 'Harga Satuan', width: "auto", attributes: { style: 'text-align: left', }, editor: harga_satuanEditor },
            {
                field: 'harga_total', title: 'Harga Total', width: "auto", attributes: { style: 'text-align: left' },
                footerTemplate: "<span id='txt_TotalPenjualan'> #=window.calcTotal()#</span>",
                //aggregates: ["sum"],
                //footerTemplate: "#=sum#",
                //groupFooterTemplate: "#: sum #",
                //footerAttributes: {
                //    "class": "table-footer-cell",
                //    style: "text-align: center; font-size: 14px"
                //},
            },


        ],
        dataBinding: function () {
            window.RecNumerEq = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        },
        dataBound: function (e) {
            var grid = $("#grid_itempenjualan").data("kendoGrid");
            if (is_show_action_itempenjualan == false)
            {
                grid.hideColumn("coms");
                $("#grid_itempenjualan .k-grid-toolbar").hide();
            }
            else {
                grid.showColumn("coms");
                $("#grid_itempenjualan .k-grid-toolbar").show();

            }
        }
    });

}

function calcTotal() {

    $.ajax({
        url: $("#urlPath").val() + "/Transaksi/ReadTotalPenjualan?no_transaksi=" + $("#txt_no_trans_jual").val(),
        contentType: 'application/json',
        dataType: "json",
        type: "POST",
        success: function (response) {
            console.log(response);

            $("#txt_TotalPenjualan").html(response);

        }
    });

}


var jumlah, harga_satuan, total;

function jumlahEditor (container, options) {
    $('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            change: function () {
                jumlah = this.value();
                console.log(jumlah);
                total = jumlah * harga_satuan
                console.log(total);
                $("input[name='harga_total']").val(total);
                $("input[name='harga_total']").change();
                //$("#txt_total_jual").val(total);
            }
        });
}

function harga_satuanEditor(container, options) {
    $('<input data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoNumericTextBox({
            change: function () {
                harga_satuan = this.value();
                console.log(harga_satuan);
                total = jumlah * harga_satuan
                console.log(total);
                $("input[name='harga_total']").val(total);
                $("input[name='harga_total']").change();
                //$("#txt_total_jual").val(total);

            }
        });
}



//------------------------------------------------------------End Add Item Penjualan-------------------------------------------\\