# liferay-grunt
An example of a grunt build file for a current Liferay 6.2 project. 

#### Included in this gruntfile:
* File sync to Tomcat on save
* Javascript concatenation and uglification
* SVG optimization and spriting
* Version based cachebreaker 
* Watch task to trigger SASS recompile

#### To use this grunt file with liferay:
* Copy the gruntfile and package.json file to the src root of your theme directory.
* Type 'npm install'
* Type 'grunt'
* If utilizing the 'grunt watch' task, edit the tomcatTheme directory to point to your theme's directory in Tomcat


We are using this in conjuction with a Maven frontend build task. If you have any questions, feel free to reach out.
