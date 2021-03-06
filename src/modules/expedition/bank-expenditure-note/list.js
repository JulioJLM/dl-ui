import { inject } from 'aurelia-framework';
import Service from './service';
import { Router } from 'aurelia-router';
import moment from 'moment';
import numeral from 'numeral';

@inject(Router, Service)
export class List {
    context = ['Rincian'];

    columns = [
        { field: 'DocumentNo', title: 'No. Bukti Pengeluaran Barang' },
        {
            field: '_CreatedUTC', title: 'Tanggal', formatter: function (value, data, index) {
                return moment(value).format('DD MMM YYYY');
            },
        },
        { field: 'BankName', title: 'Bank' },
        { field: 'SupplierName', title: 'Supplier' },
        {
            field: 'GrandTotal', title: 'Total DPP+PPN', formatter: function (value, data, index) {
                return numeral(value).format('0,000.00');
            },
        },
        { field: 'BankCurrencyCode', title: 'Mata Uang' }
    ];

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    loader = (info) => {
        let order = {};
        if (info.sort)
            order[info.sort] = info.order;
        let arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order,
        };

        return this.service.search(arg)
            .then(result => {
                return {
                    total: result.data.total,
                    data: result.data
                }
            });
    }

    contextClickCallback(event) {
        let arg = event.detail;
        let data = arg.data;

        switch (arg.name) {
            case 'Rincian':
                this.router.navigateToRoute('view', { id: data.Id });
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}