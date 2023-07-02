import React from 'react';

function InfoHeader(){
    return(
        <head>
        <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
        <meta name="description" content="Zalando Tech Radar: a tool to visualize technology choices, inspire and support Engineering teams at Zalando to pick the best technologies for new projects"/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Zalando Tech Radar</title>
        <link rel="shortcut icon" href="https://www.zalando.de/favicon.ico"/>

        <script src="https://d3js.org/d3.v4.min.js"></script>
        <script src="radar.js"></script>
      </head>
    )
};

export default InfoHeader;