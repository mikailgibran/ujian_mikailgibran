$(document).ready(function () {
    CountPenjualan_HariIni();
    CountPenjualan_BulanIni()
    CountPenjualan_TahunIni()
    CountPenjualan_TahunLalu()
    LoadChartBarHariIni();
    LoadChartBarBulanIni()
    LoadChartBarTahunIni();
    LoadChartBarTahunLalu()
});

function CountPenjualan_HariIni() {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: $("#urlPath").val() + "/Dashboard/getCount",
        success: function (response) {
            console.log(response)
            $("#hari_ini").text(response[0].penjualan_hari_ini);
            $("#hari_ini").change();
           
        }
    });
}

function CountPenjualan_BulanIni() {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: $("#urlPath").val() + "/Dashboard/getCount",
        success: function (response) {
            console.log(response)
            $("#bulan_ini").text(response[0].penjualan_bulan_ini);
            $("#bulan_ini").change();

        }
    });
}

function CountPenjualan_TahunIni() {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: $("#urlPath").val() + "/Dashboard/getCount",
        success: function (response) {
            console.log(response)
            $("#tahun_ini").text(response[0].penjualan_tahun_ini);
            $("#tahun_ini").change();

        }
    });
}

function CountPenjualan_TahunLalu() {
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        url: $("#urlPath").val() + "/Dashboard/getCount",
        success: function (response) {
            console.log(response)
            $("#tahun_lalu").text(response[0].penjualan_tahun_lalu);
            $("#tahun_lalu").change();

        }
    });
}


////----------------------------------------------------CHART BAR-----------------------------------------////

function LoadChartBarHariIni() {
    $("#chart_hari_ini").kendoChart({
        dataSource: {
            transport: {
                read: {
                    url: $("#urlPath").val() + "/Dashboard/AJaxChartBar?tipe=" + 1,
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "data",
                total: "total"
            },

        },
        legend: {
            visible: true,
            position: "bottom",
            //font: "500px sans-serif"
        },
        seriesDefaults: {
            type: "column",
        },
        chartArea: {
            height: 350
        },
        series: [{
            name: "total",
            field: "total"
        },
        ],


        categoryAxis: {
            field: "jenis",
            labels: {
                rotation: -45,
                font: "14px sans-serif"
            }
        },

        tooltip: {
            visible: true,
            //shared: true,
            template: "#= series.name #: #= value #",
            format: "{0:n0}",
            color: "black"
        },
        render: function (e) {
            var el = e.sender.element;

            //el.find("text:contains(SHIFT 2)")
            //   .parent()
            //   .prev("path")
            //   .attr("stroke-width", 5);


        },
        dataBound: function (e) {

        }
    });
}

function LoadChartBarBulanIni() {
    $("#chart_bulan_ini").kendoChart({
        dataSource: {
            transport: {
                read: {
                    url: $("#urlPath").val() + "/Dashboard/AJaxChartBar?tipe=" + 2,
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "data",
                total: "total"
            },

        },
        legend: {
            visible: true,
            position: "bottom",
            //font: "500px sans-serif"
        },
        seriesDefaults: {
            type: "column",
        },
        chartArea: {
            height: 350
        },
        series: [{
            name: "total",
            field: "total"
        },
        ],


        categoryAxis: {
            field: "jenis",
            labels: {
                rotation: -45,
                font: "14px sans-serif"
            }
        },

        tooltip: {
            visible: true,
            //shared: true,
            template: "#= series.name #: #= value #",
            format: "{0:n0}",
            color: "black"
        },
        render: function (e) {
            var el = e.sender.element;

            //el.find("text:contains(SHIFT 2)")
            //   .parent()
            //   .prev("path")
            //   .attr("stroke-width", 5);


        },
        dataBound: function (e) {

        }
    });
}

function LoadChartBarTahunIni() {
    $("#chart_tahun_ini").kendoChart({
        dataSource: {
            transport: {
                read: {
                    url: $("#urlPath").val() + "/Dashboard/AJaxChartBar?tipe=" + 3,
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "data",
                total: "total"
            },

        },
        legend: {
            visible: true,
            position: "bottom",
            //font: "500px sans-serif"
        },
        seriesDefaults: {
            type: "column",
        },
        chartArea: {
            height: 350
        },
        series: [{
            name: "total",
            field: "total"
        },
        ],


        categoryAxis: {
            field: "jenis",
            labels: {
                rotation: -45,
                font: "14px sans-serif"
            }
        },

        tooltip: {
            visible: true,
            //shared: true,
            template: "#= series.name #: #= value #",
            format: "{0:n0}",
            color: "black"
        },
        render: function (e) {
            var el = e.sender.element;

            //el.find("text:contains(SHIFT 2)")
            //   .parent()
            //   .prev("path")
            //   .attr("stroke-width", 5);


        },
        dataBound: function (e) {

        }
    });
}

function LoadChartBarTahunLalu() {
    $("#chart_tahun_lalu").kendoChart({
        dataSource: {
            transport: {
                read: {
                    url: $("#urlPath").val() + "/Dashboard/AJaxChartBar?tipe=" + 4,
                    contentType: "application/json",
                    type: "POST",
                    cache: false
                }
            },
            schema: {
                data: "data",
                total: "total"
            },

        },
        legend: {
            visible: true,
            position: "bottom",
            //font: "500px sans-serif"
        },
        seriesDefaults: {
            type: "column",
        },
        chartArea: {
            height: 350
        },
        series: [{
            name: "total",
            field: "total"
        },
        ],


        categoryAxis: {
            field: "jenis",
            labels: {
                rotation: -45,
                font: "14px sans-serif"
            }
        },

        tooltip: {
            visible: true,
            //shared: true,
            template: "#= series.name #: #= value #",
            format: "{0:n0}",
            color: "black"
        },
        render: function (e) {
            var el = e.sender.element;

            //el.find("text:contains(SHIFT 2)")
            //   .parent()
            //   .prev("path")
            //   .attr("stroke-width", 5);


        },
        dataBound: function (e) {

        }
    });
}

