var mongoose = require('mongoose');
var us = require('underscore');

mongoose.connect('mongodb://localhost/LINCS_L1000');

var Schema = mongoose.Schema({'sig_id':String,
	'pert_desc':String,'pert_cell':Array,'pert_dose':float,
	'pert_time':float,'pert_dose_unit':String, 'pert_time_unit':String});



var getTopPertMeta = function(sig_ids){
	var query = Model.find(sig_id:{$in:sig_ids}).select('sig_id')
}