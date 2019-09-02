# TriviaGame

Updated and complete TriviaGame by Michael Weitman

Leverages OMDB data, allowing the user to select from one of four movie categories.

A random offset (pagination) from 1..n is chosen and used to pull in 10 titles from OMDB.

From here, 10 questions, with correct answers, incorrect answers, and accompanying data
is assembled.

An animated GIF is displayed while the data is compiled; once complete, a 60 second timer
countdown will commece.

A setTimeout function is instantiated to clear trailing text from each prior question while
a simple setInterval based clock countds down and displays the time remaining.

At the close of the game (either by completion of 10 questions or by timer reaching 00:00),
appropriate messages are displayed along with a closing graphic icon which is randomly chosen.

Numerous div, class and id manipulation is conducted across game play, resetting state where
appropriate in order to all for restart.
 

