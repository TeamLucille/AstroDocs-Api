WDI-PVD-03 GROUP PROJECT ASTRODOCS-API
=============================================

ASTRODOCS
==========

OVERVIEW
----------
Build an app that allows users to upload files into a virtual file system. Ordinary users can only read/download a file where as Owners can do anything to the files they own. In addition to keeping track of the file structure, this app should associate meta-data with each file, including things like:

    - Date created/uploaded
    - Date modified
    - Owner (user who uploaded the file)
    - Tags


USER STORIES: OWNER
--------------------

- As a visitor to AstroDocs I need to know how to sign up so that I can become an Owner and sign in (using email, password, and password confirmation)

- As an Owner I need to be able to log in with email and password so that only I will have the ability to create, update, and delete files.  

- As an Owner I need to be able to change my my password so that I can pick a new one if I would like.  

- As an Owner I need to be able to get feedback from the website after each action's success or failure.

- As an Owner I need all forms to clear after submitting (either success or failure) so that I can resubmit forms as needed.  

- As a signed-in Owner I need to know what my options are so that I can work with my files.
    *Create files.
    *Update files.
    *Must be able to view my files single & many.

- As an Owner I need to know where my files are stored so that I can CRUD them.

- As an Owner I need to know how to add tags to my files so that I can find them later.


USER STORIES: VISITOR
----------------------

- As a non-authorized Visitor to AstroDocs I need to be able to browse recent/ all uploaded files so that I can view them.

-  As a non-authorized Visitor I need to be able to download files that are available so that I can download them to work on them/view them locally. 

PROJECT REQUIREMENTS
---------------------
- Host on your public Github page, not Github  Enterprise.
- Deploy client application on GH pages
- Deploy server application on Heroku.
- Making frequent, cohesive commits dating  back to the first day of the project week.
- 1 commit on the first day of project week on both repos.
- At least 1 commit every day during project week (not necessarily on both repos).
- All repositories must have commits from every team member.
- When pairing, include each developer's name in the commit message.

TECH USED
----------

- EXPRESS
- NODE
- MONGODB
- MONGOOSE
- AWS-AMAZON
- HEROKU


CHALLENGES
------------

- Integrating Multer middleware
- Uploading files

FUTURE DEVELOPMENTS
-------------------

- Currently Owners can set up tags, but in the future we want set up the ability for Visitors to search by tags.

- In the future we would like to add the ability for visitors to the site to become collaboraors and have the ability to add comments to the the files (even though they are not the owners of the files)

- Link to Future Developments ERD:
    https://docs.google.com/document/d/1kB9eT2_IIBuNgMBuWt2Amfwz0ECSLyfELlENOnzs9l0/edit?usp=sharing



OTHER LINKS
-----------------
To see information about the front-end for AstroDocs, please click here: 

[Imgur](https://i.imgur.com/A2Dqi7k.jpg)

This is the Link for our ERD: 
[Imgur](https://i.imgur.com/mKZGyl5.jpg)

![picture][erd]







