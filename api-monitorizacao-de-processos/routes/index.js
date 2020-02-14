var express = require('express');
var router = express.Router();

var snmp = require ('net-snmp');
const si = require('systeminformation');
var memory = "";
si.mem()
    .then(data => memory = data.total)
    .catch(error => console.error(error));
var hostip = "127.0.0.1";
var options = {
    port: '161'
};
var session = snmp.createSession(hostip, "public", options);
var maxRepetitions = 20;
var lista = [];
var re;
var u=0;
var nu=0;
var mu=0;
var oid = "1.3.6.1.2.1.25.4.2";
var oidpf = "1.3.6.1.2.1.25.5.1";
var hosts = [
    '127.0.0.1',
    '192.168.1.67',
    '192.168.1.1',
];
var udp = [
    '161',
    '3000'
];

/* GET home page. */
router.get('/', function(req, res, next) {
    re = res;
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    session.table(oid, maxRepetitions, getProcesses);
  });


/* GET home page. */
router.get('/percentagem', function(req, res, next) {
    re = res;
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    session.table(oidpf, maxRepetitions, getPercentagem);
});

/* GET home page. */
router.get('/hosts', function(req, res, next) {
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    res.jsonp(hosts)
});
/* GET home page. */
router.post('/hosts', function(req, res, next) {
    hosts.push(req.body.host);
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    res.send({'hosts':'done'})
});

/* GET home page. */
router.get('/udp', function(req, res, next) {
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    res.jsonp(udp)
});
/* GET home page. */
router.post('/udp', function(req, res, next) {
    udp.push(req.body.udp)
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    res.send({'udp':'done'})
});

/* GET home page. */
router.post('/hostip', function(req, res, next) {
    hostip = req.body.host;
    session = snmp.createSession(hostip, "public", options);
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    res.send({'udp':'done'})
});

/* GET home page. */
router.post('/port', function(req, res, next) {
    options.port = req.body.port;
    session = snmp.createSession(hostip, "public", options);
    // The maxRepetitions argument is optional, and will be ignored unless using
    // SNMP verison 2c
    res.send({'udp':'done'})
});


function sortInt (a, b) {
    if (a > b)
        return 1;
    else if (b > a)
        return -1;
    else
        return 0;
}

function getProcesses (error, table) {
    if (error) {
        console.error (error.toString ());
    } else {
        // This code is purely used to print rows out in index order,
        // ifIndex's are integers so we'll sort them numerically using
        // the sortInt() function above
        var indexes = [];
        for (index in table)
            indexes.push (parseInt (index));
        indexes.sort (sortInt);
        // Use the sorted indexes we've calculated to walk through each
        // row in order
        for (var i = 0; i < indexes.length; i++) {
            // Like indexes we sort by column, so use the same trick here,
            // some rows may not have the same columns as otlistarows, so
            // we calculate this per row
            var columns = [];
            for (column in table[indexes[i]])
                columns.push (parseInt (column));
            columns.sort (sortInt);
            
            // Print index, then each column indented under listaindex
            //console.log ("row for index = " + indexes[i]);lista
            var proc = {
              id: -1,
              nome: 'nvo',
              caminho: 'nvo'
            };
            for (var j = 0; j < columns.length; j++) {
                if(j == 0) proc.id = table[indexes[i]][columns[j]];
                if(j == 1) proc.nome = table[indexes[i]][columns[j]].toString();
                if(j == 3) proc.caminho = table[indexes[i]][columns[j]].toString();
            }
            lista.push(proc);
        }
        re.jsonp(lista);
        lista = [];
    }
}

function getPercentagem (error, table) {
    if (error) {
        console.error (error.toString ());
    } else {
        // This code is purely used to print rows out in index order,
        // ifIndex's are integers so we'll sort them numerically using
        // the sortInt() function above
        var indexes = [];
        for (index in table)
            indexes.push (parseInt (index));
        indexes.sort (sortInt);
        // Use the sorted indexes we've calculated to walk through each
        // row in order
        for (var i = 0; i < indexes.length; i++) {
            // Like indexes we sort by column, so use the same trick here,
            // some rows may not have the same columns as otlistarows, so
            // we calculate this per row
            var columns = [];
            for (column in table[indexes[i]])
                columns.push (parseInt (column));
            columns.sort (sortInt);
            
            // Print index, then each column indented under listaindex
            //console.log ("row for index = " + indexes[i]);lista
            var proc = {
              value: 'nvo',
              mem: ''
            };
            for (var j = 0; j < columns.length; j++) {
                if(j == 0) proc.value = table[indexes[i]][columns[j]];
                if(j == 1) proc.mem = table[indexes[i]][columns[j]];
            }
            if(proc.value===0) nu++; else u++;
            if(proc.mem!==0) mu += proc.mem;
            
        }
        var memoria= [
            ['Memoria', 'N'],
            ['Memoria utilizada', mu],
            //1300000 so??
            ['Memoria não utilizada', (((memory/1000)+1300000)-mu)]
          ];

        var per= [
            ['escalonamento', 'N'],
            ['Escalonados', u],
            ['Não Escalonados', nu]
          ];

        var obj = {
            mem: memoria,
            per: per
        }

        re.jsonp(obj);
        nu = 0; u = 0;
        mu = 0;
    }
}

module.exports = router;