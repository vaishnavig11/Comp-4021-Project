# Comp-4021-Project

Project Proposal 
1. Overview. What will the project do? For example, when it is finished, what can people do with it? 
The idea is to design a useful-friendly user interface for showing information about out-bound exchange institutions in the U.S.A. that HKUST has partnered with, for students in school of engineering. Currently, if a student wants to find an institution’s information, he is required to collect data from a multitude of websites all of which have their own layout. This is a very time-consuming process since there is a lot of different information he needs to collect to thoroughly understand the institution's exchange programme. For example, he needs to go to the transfer course database to check which courses could be transferred back to HKUST, which courses are particularly offered for exchange students, the minimum GPA requirement, the English language requirement etc. 
Thus, to overcome this issue and to make the process of exchange application easier, we intend to design a web-application to show all the below useful information about the various institutions in a consolidated manner:
Ranking of the institution for Engineering. usnews
Link to their official websites
Duration of the program (only fall, only spring or both) 
List of courses offered specifically for exchange students (along with prerequisites for the courses)
List of courses offered in exchange institution and their equivalent course at HKUST (for transferring credits back) 
The CGPA requirements
The English language requirements
List of activities/clubs exchange students can participate in 
Housing information 
Any special notes provided by HKUST Seng department. 
Since we are a group of 3, we decided that instead of manually researching and gathering this information about each of the institutions, we will be implementing a Syper that crawls and automatically collects the required information from the websites of the different institutions. All the gathered information will be stored in a Database. The UI will be a USA map with icons for the different institutions across the US. When the user hovers over the icon, basic information such as the institution's name and ranking will be available. Upon clicking on the ison, the user will be guided to another webpage, where he will find all the above-mentioned information in detail. The UI will also allow the user to execute a search function (explained below). All of this information will be sufficient for the user to decide which exchange institution he is interested in. 
2. The browser. What will happen in the client (the browser)? What technologies will you use in the browser?

We will combine the information crawl by our spyder program and display it with a USA map.  An alternate table format view would also be available (if time permits). Also, a search bar and filtering options that would let the user find the university with keywords will be implemented. Matching is available when the user provides a list of information and we will display the university which he or she can apply to. For example, users could search which university accepts Toefl score below 100 or which university offers both fall and spring semester options. We are going to use vue.js to display our data and bootstrap to tidy up the display of information. 

3. The server. What will happen on the server? What technologies will you use in the server?
We will be implementing a Syper in Javascript and run it in Node.js server. The Spyder crawls and automatically collects the required information from the websites of the different institutions. All the gathered information will be stored in a mysql Database. The server will  be used for connecting the browser (UI) with the database. 
