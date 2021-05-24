function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var specificSample = sampleArray.filter(desiredSample => desiredSample.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var specificSampleResult = specificSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = specificSampleResult.otu_ids;
    var otu_labels = specificSampleResult.otu_labels;
    var sample_values = specificSampleResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.
    
    console.log(otu_ids);
    //console.log(otu_labels);
    console.log(sample_values);

    var sorted_otu_ids_string = otu_ids.map(id => "OTU " + id).slice(0,10).reverse();
    
    //console.log("test: "+otu_ids_string);
    var sorted_sample_values = sample_values.slice(0, 10).reverse();
    //var topTenotu_ids = otu_ids.sort((a, b) => a - b).reverse();

    var sorted_otu_labels = otu_labels.slice(0, 10).reverse();

    //console.log(sorted_sample_values);

    //topTenotu_ids = otu_ids.map(ids => parseInt(ids));

    //console.log(topTenotu_ids);
    //topTenotu_ids = topTenotu_ids.slice(0, 10);

    //console.log(otu_ids_string);

    var yticks = sorted_otu_ids_string;

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sorted_sample_values,
      y: yticks,
      text: sorted_otu_labels,
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacterial Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

    //Deliverable 2

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        colorscale: 0.5,
        size: sample_values
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culture per Sample",
      xaxis: {title: "UTO IDs"},
      hovermode: otu_labels
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    //Deliverable 3

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata.filter(tempObj => tempObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var metadata_result = metadata[0];
    //console.log(metadata_result);
    // 3. Create a variable that holds the washing frequency.
    var wfrq = metadata_result.wfreq;
    //console.log(wfrq)
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0,1], y: [0,1]},
		  value: wfrq,
		  title: {text: "Scrubs per Week"},
		  type: "indicator",
		  mode: "gauge+number",
      gauge: {
        bar: {color: "black"},
        axis: {
          range: [null, 10],
          tickwidth: 1,
          tickmode: "array",
          tickvals: [0, 2, 4, 6, 8, 10],
          tickcolor: "black"
        },
        steps: [
          {range: [0, 2], color: "red"},
          {range: [2, 4], color: "orange"},
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "green"},
          {range: [8, 10], color: "darkgreen"}
        ]

      }
     
  }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     title: "Belly Button Washing Frequency",
     width: 450,
     height: 450
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    
  });
}
