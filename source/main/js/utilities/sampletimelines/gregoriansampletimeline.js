/*
  Copyright (C) 2021  Roger Lindberg, Rickard Lindberg

  This file is part of TimelineJs.

  TimelineJs is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  TimelineJs is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with TimelineJs.  If not, see <http://www.gnu.org/licenses/>.
*/


function gregorianSampleTimeline() {
	let xml = `<?xml version="1.0" encoding="utf-8"?>
  <timeline>
    <version>2.5.0 (67ed963f67ff 2021-10-05)</version>
    <timetype>gregoriantime</timetype>
    <eras>
      <era>
        <name>Sample Era3</name>
        <start>2021-11-27 00:00:00</start>
        <end>2021-12-17 00:00:00</end>
        <color>238,219,240</color>
      </era>
      <era>
        <name>Sample Era1</name>
        <start>2021-10-27 00:00:00</start>
        <end>2021-11-10 00:00:00</end>
        <color>198,251,245</color>
      </era>
    </eras>
    <categories>
      <category>
        <name>Welcome</name>
        <color>235,82,255</color>
        <done_color>255,153,153</done_color>
        <font_color>0,0,0</font_color>
      </category>
      <category>
        <name>Introduction</name>
        <color>250,250,20</color>
        <done_color>252,252,138</done_color>
        <font_color>0,0,0</font_color>
      </category>
      <category>
        <name>Functions</name>
        <color>45,130,210</color>
        <done_color>131,131,251</done_color>
        <font_color>250,250,20</font_color>
      </category>
      <category>
        <name>Saving</name>
        <color>40,154,40</color>
        <done_color>48,195,48</done_color>
        <font_color>0,0,0</font_color>
      </category>
    </categories>
    <events>
      <event>
        <start>2021-10-31 17:36:49</start>
        <end>2021-11-15 19:53:46</end>
        <text>[2]Container-1</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <description>A container can also have a description</description>
        <default_color>240,206,132</default_color>
      </event>
      <event>
        <start>2021-11-10 19:45:39</start>
        <end>2021-11-28 19:10:38</end>
        <text>[1]Container-2</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <default_color>249,113,113</default_color>
      </event>
      <event>
        <start>2021-10-31 17:36:49</start>
        <end>2021-11-06 17:36:49</end>
        <text>(2)Remove Event</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Functions</category>
        <description>Double-click on the Event to open the Edit Events... dialog.

Or select Edit / Edit Events... from the main menu.

Or click on the event to mark it and hit the Delete button.
        </description>
        <default_color>200,200,200</default_color>
      </event>
      <event>
        <start>2021-11-23 19:10:38</start>
        <end>2021-11-28 19:10:38</end>
        <text>(1)Select Event</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Introduction</category>
        <description>Click with the left mouse button on an event to select it.</description>
        <default_color>240,193,92</default_color>
      </event>
      <event>
        <start>2021-11-05 13:56:44</start>
        <end>2021-11-11 13:56:44</end>
        <text>(2)Edit Event</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Functions</category>
        <description>Double-click on the Event to open the Edit Events... dialog.

Or select Edit / Edit Events... from the main menu.</description>
        <default_color>200,200,200</default_color>
      </event>
      <event>
        <start>2021-11-10 15:17:57</start>
        <end>2021-11-15 19:53:46</end>
        <text>(2)Create Event</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Functions</category>
        <description>Select Edit / Edit Events... from the main menu to open
the Edit Events dialog.</description>
        <default_color>200,200,200</default_color>
      </event>
      <event>
        <start>2021-11-10 19:45:39</start>
        <end>2021-11-17 16:53:42</end>
        <text>(1)Change my size</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Introduction</category>
        <description>First select the event with a left mouse click.
Drag the left or right handles to change the Event size.</description>
        <default_color>200,200,200</default_color>
      </event>
      <event>
        <start>2021-11-16 22:10:07</start>
        <end>2021-11-26 00:46:14</end>
        <text>(1)Move me</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <description>First select the event with a left mouse click.
Drag the center handle to move the Event.</description>
        <default_color>250,250,20</default_color>
      </event>
      <event>
        <start>2021-11-02 00:00:00</start>
        <end>2021-11-02 00:00:00</end>
        <text>A</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <description>Start Milestone</description>
        <default_color>255,255,128</default_color>
        <milestone>True</milestone>
      </event>
      <event>
        <start>2021-11-29 20:41:25</start>
        <end>2021-11-29 20:41:25</end>
        <text>B</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <description>End milestone</description>
        <default_color>255,255,128</default_color>
        <milestone>True</milestone>
      </event>
      <event>
        <start>2021-11-11 21:59:05</start>
        <end>2021-11-11 21:59:05</end>
        <text>Move the mouse over me!</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Introduction</category>
        <description>If uou move the mouse over an event, the event description
is shown in a speach bubble above the event (If the feature is enabled in settings).

Pressing the Alt-key when clicking an event makes the spech bubble to stick with
the event even when the mouse is not over the event.
A second Alt-click will remove the stickyness.
</description>
        <default_color>200,200,200</default_color>
      </event>
      <event>
        <start>2021-11-10 15:39:18</start>
        <end>2021-11-10 15:39:18</end>
        <text>Welcome to TimelineJs!</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Welcome</category>
        <description>TimelineJs is a an application for displaying and navigating events on a timeline.

Timeline is free software, distributed under the GNU General Public License version 3.</description>
        <default_color>200,200,200</default_color>
      </event>
      <event>
        <start>2021-11-17 15:39:18</start>
        <end>2021-11-24 15:39:18</end>
        <text>Locked!</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>True</locked>
        <ends_today>False</ends_today>
        <category>Saving</category>
        <description>A locked Event can't be moved or resized.</description>
        <default_color>200,200,200</default_color>
      </event>
      <event>
        <start>2021-11-04 20:59:21</start>
        <end>2021-11-10 05:17:37</end>
        <text>Scrolla</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>True</ends_today>
        <category>Functions</category>
        <description>Click and hold down the left mouse button on the timeline and drag it.
You can also use the mouse wheel + Alt-button.
        </description>
        <default_color>240,193,92</default_color>
      </event>
      <event>
        <start>2021-11-09 18:34:37</start>
        <end>2021-11-21 22:47:46</end>
        <text>Zoom</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Functions</category>
        <description>Use the mouse wheel to zoom in and zoom out.
An alternative is to select menues under the Show main menu.</description>
        <default_color>240,193,92</default_color>
      </event>
      <event>
        <start>2021-11-02 18:34:37</start>
        <end>2021-11-12 22:47:46</end>
        <text>Fuzzy ends</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>True</fuzzy_start>
        <fuzzy_end>True</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Saving</category>
        <description>Fuzzy ends describe uncertainty about when an Event starts or ends.</description>
        <default_color>240,193,92</default_color>
      </event>
      <event>
        <start>2021-11-22 17:04:30</start>
        <end>2021-11-22 17:04:30</end>
        <text>Saving</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Saving</category>
        <description>The timeline is autmatically saved in regular intervalls.

The time intervall is a user setting.
Selecting Edit / Edit Settings... from the main menu opens
the edit Settings dialog.</description>
        <default_color>50,200,50</default_color>
      </event>
      <event>
        <start>2021-11-05 17:04:30</start>
        <end>2021-11-05 17:04:30</end>
        <text>Settings</text>
        <fuzzy>False</fuzzy>
        <fuzzy_start>False</fuzzy_start>
        <fuzzy_end>False</fuzzy_end>
        <locked>False</locked>
        <ends_today>False</ends_today>
        <category>Saving</category>
        <description>Select 'Settings' under the 'Edit' menu to display settable features.</description>
        <default_color>50,200,50</default_color>
      </event>
    </events>
    <view>
      <displayed_period>
        <start>2021-10-28 19:42:22</start>
        <end>2021-12-02 18:35:52</end>
      </displayed_period>
      <hidden_categories>
      </hidden_categories>
    </view>
  </timeline>`
	loadRepoFromText(xml);
  setReadOnly();
}