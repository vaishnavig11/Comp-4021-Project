# NodeJS Files
1. ranking.js: Crawls and stores the rank of each university and stores it in rank.json 
2. location.js: Crawls and stores the location coordinates of each university and stores it in location.json 
3. ust_link.js: Crawls and stores the official website links for each university in link.json
4. accommodation.js: Crawl and stores the accommodation information of the different universities via google search and stores it in accommodation.json 
5. combine.js: Combines accommodation.json and location.json, matchs the name of the universities and stores it in combine.json
6. ust_info_scraper.js: Crawls and stores the credit transfer information for each university, combine all json file into a single file, and output in final.json

# JSON Files
1. StartingInfo.json: Basic information about each exchange institution: University Name, Program Duration, CGA and Language Requirements, Special Notes from SENG
2. rank.json: Generated when ranking.js is executed: Additional field 'rank' included. 
3. location.json: Generated when location.js is executed: Additional field 'location' included.
4. link.json: Generated when ust_link.js is executed: Additional field 'link' included. 
5. accommodation.json: Generated when accommodation.js is executed: Additional field 'accommodation_res' included. 
6. combine.json: Generated when combine.js is executed.
7. final.json: Generated when ust_info_scraper.js is executed: Final JSON file read by the Browser (HTML) to display information in the UI.

# HTML Files
1. exchange.html: This file reads the information stored in final.json and displays the information on a USA Map.

# Procedure to Update the JSON File With Latest Information: Execute the NodeJS files in below order to update the JSON files and generate final.json which is read by the HTML file to display updated information in the browser
1. ranking.js
2. location.js
3. ust_link.js
4. accommodation.js
5. combine.js
6. ust_info_scraper.js
