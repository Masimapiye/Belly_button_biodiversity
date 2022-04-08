// build the drop down menu
function menuSelector(){

    var IDSelector = d3.select("#selDataset");
   // Read in the JSON data
   d3.json("samples.json").then((data) => {
       var sampleIDs = data.names;
       sampleIDs.forEach((ID) => {
           IDSelector.append("option")
           .text(ID).property("value",ID);

       });
       buildPlots(sampleIDs[0]);
       DemoInfo(sampleIDs[0]);

   });
}

menuSelector();

// Function to populate demographic info

function DemoInfo(patients) {

  var DemoInfoBox = d3.select("#sample-metadata");

  d3.json("samples.json").then(data => {
      var metadata = data.metadata
      var filteredMetadata = metadata.filter(metaID => metaID.id == patients)[0];
      console.log(filteredMetadata)

      // Use `.html("") to clear any existing metadata
    DemoInfoBox.html("");

      Object.entries(filteredMetadata)
      .forEach(([key, value]) => {
        DemoInfoBox.append("p")
        .text(`${key}: ${value}`)
      })


  })
}

DemoInfo()

//Function to change patient data
function optionChanged(patients) {
  buildPlots(patients);
  DemoInfo(patients)
}



// Build function to build plots for patients
function buildPlots(patients) {

// Read in the JSON data
     d3.json("samples.json").then((data) => {

     var samples = data.samples;
// check samples
     console.log(samples);


    var metadata = data.metadata;
    // check metadata
    //console.log(metadata);

     //Filter the patient IDs from metadata and samples
  var filteredMetadata = metadata.filter(metaID => metaID.id == patients)[0];
    //  Check filteredMetadata 
   // console.log(filteredMetadata);

     // Filter by patient ID
      var filteredPatientID = samples.filter(sampleID => sampleID.id == patients)[0];
     // Check filtered patientID
       console.log(filteredPatientID);

      
       // Grab sample_values for the bar chart
      var sample_values = filteredPatientID.sample_values;

     // Use otu_ids as the labels for bar chart
       var otu_ids = filteredPatientID.otu_ids;

        // use otu_labels as the hovertext for bar chart
       var otu_labels = filteredPatientID.otu_labels;


// Create trace.
var bar_trace = {
    x: sample_values.slice(0, 10).reverse(),
    y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
    text: otu_labels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h"
  };
  
  // Create the data array 
  var bar_data = [bar_trace];
  
  // plot layout
  var bar_layout = {    
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };
  
  Plotly.newPlot("bar", bar_data, bar_layout);


// BUBBLE CHART

// Create the trace
  var bubble_trace = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      color: otu_ids,
      size: sample_values,
      colorscale: 'YlOrRd'
    }
};

  var bubble_data = [bubble_trace];

// Plot layout
var bubble_layout = {
   xaxis: { title: "OTU ID" },
  yaxis: { title: "Sample Values" },
  showlegend: false
};


Plotly.newPlot('bubble', bubble_data, bubble_layout)

// Gauge plot

var wfreq = filteredMetadata.wfreq



var gauge_data = [
  {
    domain: { x: [0, 1], y: [0, 1] },
				value: wfreq,
				title: {text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week'},
				type: "indicator",
				mode: "gauge+number",
				gauge: {
					axis: { range: [null, 9] },
					steps: [
						{ range: [0, 1], color: 'rgb(248, 243, 236)' },
						{ range: [1, 2], color: 'rgb(244, 241, 229)' },
						{ range: [2, 3], color: 'rgb(233, 230, 202)' },
						{ range: [3, 4], color: 'rgb(229, 231, 179)' },
						{ range: [4, 5], color: 'rgb(213, 228, 157)' },
						{ range: [5, 6], color: 'rgb(183, 204, 146)' },
						{ range: [6, 7], color: 'rgb(140, 191, 136)' },
						{ range: [7, 8], color: 'rgb(138, 187, 143)' },
						{ range: [8, 9], color: 'rgb(133, 180, 138)' },
					],
				}
			}
		
		
	
  
];

var gauge_layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
Plotly.newPlot('gauge', gauge_data, gauge_layout);
});
}
