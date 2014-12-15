'use strict'

describe('Rubik App',function(){

	describe('Index View',function(){

		beforeEach(function(){

			browser.get('http://localhost:8080/rubik/');
			// global variable
			browser.data = require('../e2e-test-data/input.json')
			browser.hasClass = function (element, cls) {
					return element.getAttribute('class').then(function (classes) {
							return classes.split(' ').indexOf(cls) !== -1;
					});
				};
		});

		it('should add input areas and fill in gene lists and tags',
			function(){
				var inputs = element.all(by.repeater('geneList in geneLists'));
				// first a with plus class is minus sign and 
				// 2nd a with plus class is the plus sign
				var add = element.all(by.css('a.plus')).get(1);
				
				add.click();
				expect(inputs.count()).toBe(2);

				inputs.map(function(input,i){
					var desc = input.element(by.model("geneList.tag"));
					var genes = input.element(by.model("geneList.genes"));

					desc.evaluate('geneList.tag="'+browser.data[i].tag+'"');
					console.log("########",'geneList.tag="'+browser.data[i].tag+'"');
					genes.evaluate("geneList.data='"+browser.data[i].genes+"'");

					desc.sendKeys(browser.data[i].tag);
					genes.sendKeys(browser.data[i].genes);
				});

				expect(!browser.hasClass(element(by.css('button.custom-button')),
					"pure-button-disabled"));

				browser.executeScript('console.log("hello")');
				console.log('i am here');

				browser.pause();

			});
	});

});