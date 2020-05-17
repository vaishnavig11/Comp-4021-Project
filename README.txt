NodeJS Files
1. ranking.js: Crawls and stores the rank of each university and stores it in rank.json 
2. location.js: Crawls and stores the location coordinates of each university and stores it in location.json 
3. accommodation.js: Crawl and stores the accommodation information of the different universities via google search and stores it in accommodation.json 
4. ust_info_scraper.js: Crawls and stores the official website links and credit transfer information for each university in link.json and credit_transfer.json
5. combine.js: Combines credit_transfer.json and location.json, matchs the name of the universities and stores it in combine.json

JSON Files
1. StartingInfo.json: Basic information about each exchange institution: University Name, Program Duration, CGA and Language Requirements, Special Notes from SENG
2. rank.json: Generated when ranking.js is executed: Additional field 'rank' included. 
3. location.json: Generated when location.js is executed: Additional field 'location' included. 
4. accommodation.json: Generated when accommodation.js is executed: Additional field 'accommodation_res' included. 
5. link.json: Generated when ust_info_scraper.js is executed: Additional field 'link' included. 
6. credit_transfer.json: Generated when ust_info_scraper.js is executed: Additional field 'courses' included. (deleted because its content is scraped when final.json is generated)
7. combine.json: Generated when combine.js is executed.
8. final.json: Final JSON file read by the Browser (HTML) to display information in the UI. (where exactly is this generated?- Victor)

HTML Files
1. exchange.html: This file reads the information stored in Join_link_location_credit.json and displayes the information on a USA Map.

Update JSON File
Execute the NodeJS files in below order to update the JSON files. 
1. ranking.js
2. location.js
3. Victor pls write the order for your files