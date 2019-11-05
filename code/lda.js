/*
 * Based on http://www.arbylon.net/projects/LdaGibbsSampler.java
 */
// jshint esversion: 6

function makeArray(x) {
    var a = new Array();
    for (var i = 0; i < x; i++) {
        a[i] = 0;
    }
    return a;
}

function make2DArray(x, y) {
    var a = new Array();
    for (var i = 0; i < x; i++) {
        a[i] = new Array();
        for (var j = 0; j < y; j++)
            a[i][j] = 0;
    }
    return a;
}

var lda = new function () {
    var documents, z, nw, nd, nwsum, ndsum, thetasum, phisum, V, K, alpha, beta;
    var THIN_INTERVAL = 20;
    var BURN_IN = 100;
    var ITERATIONS = 1000;
    var SAMPLE_LAG;
    var dispcol = 0;
    var numstats = 0;
    this.configure = function (docs, v, iterations, burnIn, thinInterval, sampleLag) {
        this.ITERATIONS = iterations;
        this.BURN_IN = burnIn;
        this.THIN_INTERVAL = thinInterval;
        this.SAMPLE_LAG = sampleLag;
        this.documents = docs;
        this.V = v;
        this.dispcol = 0;
        this.numstats = 0;
    };


    this.initialState = function (K) {
        var i;
        var M = this.documents.length;
        this.nw = make2DArray(this.V, K);
        this.nd = make2DArray(M, K);
        this.nwsum = makeArray(K);
        this.ndsum = makeArray(M);
        this.z = new Array();
        for (i = 0; i < M; i++)
            this.z[i] = new Array();
        for (var m = 0; m < M; m++) {
            var N = this.documents[m].length;
            this.z[m] = new Array();
            for (var n = 0; n < N; n++) {
                var topic = parseInt("" + (Math.random() * K));
                this.z[m][n] = topic;
                this.nw[this.documents[m][n]][topic]++;
                this.nd[m][topic]++;
                this.nwsum[topic]++;
            }
            this.ndsum[m] = N;
        }
    };

    this.gibbs = function (K, alpha, beta) {
        var i;
        this.K = K;
        this.alpha = alpha;
        this.beta = beta;
        if (this.SAMPLE_LAG > 0) {
            this.thetasum = make2DArray(this.documents.length, this.K);
            this.phisum = make2DArray(this.K, this.V);
            this.numstats = 0;
        }
        this.initialState(K);
        for (i = 0; i < this.ITERATIONS; i++) {
            for (var m = 0; m < this.z.length; m++) {
                for (var n = 0; n < this.z[m].length; n++) {
                    var topic = this.sampleFullConditional(m, n);
                    this.z[m][n] = topic;
                }
            }
            if ((i < this.BURN_IN) && (i % this.THIN_INTERVAL == 0)) {
                this.dispcol++;
            }
            if ((i > this.BURN_IN) && (i % this.THIN_INTERVAL == 0)) {
                this.dispcol++;
            }
            if ((i > this.BURN_IN) && (this.SAMPLE_LAG > 0) && (i % this.SAMPLE_LAG == 0)) {
                this.updateParams();
                if (i % this.THIN_INTERVAL != 0)
                    this.dispcol++;
            }
            if (this.dispcol >= 100) {
                this.dispcol = 0;
            }
        }
    };


    this.sampleFullConditional = function (m, n) {
        var topic = this.z[m][n];
        this.nw[this.documents[m][n]][topic]--;
        this.nd[m][topic]--;
        this.nwsum[topic]--;
        this.ndsum[m]--;
        var p = makeArray(this.K);
        for (var k = 0; k < this.K; k++) {
            p[k] = (this.nw[this.documents[m][n]][k] + this.beta) / (this.nwsum[k] + this.V * this.beta)
                * (this.nd[m][k] + this.alpha) / (this.ndsum[m] + this.K * this.alpha);
        }
        for (var k = 1; k < p.length; k++) {
            p[k] += p[k - 1];
        }
        var u = Math.random() * p[this.K - 1];
        for (topic = 0; topic < p.length; topic++) {
            if (u < p[topic])
                break;
        }
        this.nw[this.documents[m][n]][topic]++;
        this.nd[m][topic]++;
        this.nwsum[topic]++;
        this.ndsum[m]++;
        return topic;
    };

    this.updateParams = function () {
        for (let m = 0; m < this.documents.length; m++) {
            for (let k = 0; k < this.K; k++) {
                this.thetasum[m][k] += (this.nd[m][k] + this.alpha) /
                    (this.ndsum[m] + this.K * this.alpha);
            }
        }
        for (let k = 0; k < this.K; k++) {
            for (let w = 0; w < this.V; w++) {
                this.phisum[k][w] += (this.nw[w][k] + this.beta) /
                    (this.nwsum[k] + this.V * this.beta);
            }
        }
        this.numstats++;
    };

    // theta[m][k] distribution of topic k in document m
    // thetasum cumulative statistics of theta
    // nd[i][j] number of words in document i assigned to topic j
    // ndsum[i] total number of words in document i
    // numstats size of statistics

    this.getTheta = function () {
        var theta = new Array();
        for (var i = 0; i < this.documents.length; i++) theta[i] = new Array();
        if (this.SAMPLE_LAG > 0) {
            for (let m = 0; m < this.documents.length; m++) {
                for (let k = 0; k < this.K; k++) {
                    theta[m][k] = this.thetasum[m][k] / this.numstats;
                }
            }
        } else {
            for (let m = 0; m < this.documents.length; m++) {
                for (let k = 0; k < this.K; k++) {
                    theta[m][k] = (this.nd[m][k] + this.alpha) /
                        (this.ndsum[m] + this.K * this.alpha);
                }
            }
        }
        return theta;
    };

    // phi[m][k] distribution of word w in topic k
    // phisum cumulative statistics of phi
    // nw[i][j] number of instances of word i (term?) assigned to topic j
    // nwsum[j] total number of words assigned to topic j
    // numstats size of statistics

    this.getPhi = function () {
        var phi = new Array();
        for (var i = 0; i < this.K; i++)
            phi[i] = new Array();
        if (this.SAMPLE_LAG > 0) {
            for (var k = 0; k < this.K; k++) {
                for (var w = 0; w < this.V; w++) {
                    phi[k][w] = this.phisum[k][w] / this.numstats;
                }
            }
        } else {
            for (let k = 0; k < this.K; k++) {
                for (let w = 0; w < this.V; w++) {
                    phi[k][w] = (this.nw[w][k] + this.beta) /
                        (this.nwsum[k] + this.V * this.beta);
                }
            }
        }
        return phi;
    };

};