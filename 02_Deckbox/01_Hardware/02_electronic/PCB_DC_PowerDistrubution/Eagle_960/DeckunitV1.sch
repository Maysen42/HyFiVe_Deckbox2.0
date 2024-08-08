<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE eagle SYSTEM "eagle.dtd">
<eagle version="9.6.2">
<drawing>
<settings>
<setting alwaysvectorfont="no"/>
<setting verticaltext="up"/>
</settings>
<grid distance="0.1" unitdist="inch" unit="inch" style="lines" multiple="1" display="no" altdistance="0.01" altunitdist="inch" altunit="inch"/>
<layers>
<layer number="1" name="Top" color="4" fill="1" visible="no" active="no"/>
<layer number="2" name="Route2" color="16" fill="1" visible="no" active="no"/>
<layer number="3" name="Route3" color="17" fill="1" visible="no" active="no"/>
<layer number="4" name="Route4" color="18" fill="1" visible="no" active="no"/>
<layer number="5" name="Route5" color="19" fill="1" visible="no" active="no"/>
<layer number="6" name="Route6" color="25" fill="1" visible="no" active="no"/>
<layer number="7" name="Route7" color="26" fill="1" visible="no" active="no"/>
<layer number="8" name="Route8" color="27" fill="1" visible="no" active="no"/>
<layer number="9" name="Route9" color="28" fill="1" visible="no" active="no"/>
<layer number="10" name="Route10" color="29" fill="1" visible="no" active="no"/>
<layer number="11" name="Route11" color="30" fill="1" visible="no" active="no"/>
<layer number="12" name="Route12" color="20" fill="1" visible="no" active="no"/>
<layer number="13" name="Route13" color="21" fill="1" visible="no" active="no"/>
<layer number="14" name="Route14" color="22" fill="1" visible="no" active="no"/>
<layer number="15" name="Route15" color="23" fill="1" visible="no" active="no"/>
<layer number="16" name="Bottom" color="1" fill="1" visible="no" active="no"/>
<layer number="17" name="Pads" color="2" fill="1" visible="no" active="no"/>
<layer number="18" name="Vias" color="2" fill="1" visible="no" active="no"/>
<layer number="19" name="Unrouted" color="6" fill="1" visible="no" active="no"/>
<layer number="20" name="Dimension" color="24" fill="1" visible="no" active="no"/>
<layer number="21" name="tPlace" color="7" fill="1" visible="no" active="no"/>
<layer number="22" name="bPlace" color="7" fill="1" visible="no" active="no"/>
<layer number="23" name="tOrigins" color="15" fill="1" visible="no" active="no"/>
<layer number="24" name="bOrigins" color="15" fill="1" visible="no" active="no"/>
<layer number="25" name="tNames" color="7" fill="1" visible="no" active="no"/>
<layer number="26" name="bNames" color="7" fill="1" visible="no" active="no"/>
<layer number="27" name="tValues" color="7" fill="1" visible="no" active="no"/>
<layer number="28" name="bValues" color="7" fill="1" visible="no" active="no"/>
<layer number="29" name="tStop" color="7" fill="3" visible="no" active="no"/>
<layer number="30" name="bStop" color="7" fill="6" visible="no" active="no"/>
<layer number="31" name="tCream" color="7" fill="4" visible="no" active="no"/>
<layer number="32" name="bCream" color="7" fill="5" visible="no" active="no"/>
<layer number="33" name="tFinish" color="6" fill="3" visible="no" active="no"/>
<layer number="34" name="bFinish" color="6" fill="6" visible="no" active="no"/>
<layer number="35" name="tGlue" color="7" fill="4" visible="no" active="no"/>
<layer number="36" name="bGlue" color="7" fill="5" visible="no" active="no"/>
<layer number="37" name="tTest" color="7" fill="1" visible="no" active="no"/>
<layer number="38" name="bTest" color="7" fill="1" visible="no" active="no"/>
<layer number="39" name="tKeepout" color="4" fill="11" visible="no" active="no"/>
<layer number="40" name="bKeepout" color="1" fill="11" visible="no" active="no"/>
<layer number="41" name="tRestrict" color="4" fill="10" visible="no" active="no"/>
<layer number="42" name="bRestrict" color="1" fill="10" visible="no" active="no"/>
<layer number="43" name="vRestrict" color="2" fill="10" visible="no" active="no"/>
<layer number="44" name="Drills" color="7" fill="1" visible="no" active="no"/>
<layer number="45" name="Holes" color="7" fill="1" visible="no" active="no"/>
<layer number="46" name="Milling" color="3" fill="1" visible="no" active="no"/>
<layer number="47" name="Measures" color="7" fill="1" visible="no" active="no"/>
<layer number="48" name="Document" color="7" fill="1" visible="no" active="no"/>
<layer number="49" name="Reference" color="7" fill="1" visible="no" active="no"/>
<layer number="51" name="tDocu" color="7" fill="1" visible="no" active="no"/>
<layer number="52" name="bDocu" color="7" fill="1" visible="no" active="no"/>
<layer number="88" name="SimResults" color="9" fill="1" visible="yes" active="yes"/>
<layer number="89" name="SimProbes" color="9" fill="1" visible="yes" active="yes"/>
<layer number="90" name="Modules" color="5" fill="1" visible="yes" active="yes"/>
<layer number="91" name="Nets" color="2" fill="1" visible="yes" active="yes"/>
<layer number="92" name="Busses" color="1" fill="1" visible="yes" active="yes"/>
<layer number="93" name="Pins" color="2" fill="1" visible="no" active="yes"/>
<layer number="94" name="Symbols" color="4" fill="1" visible="yes" active="yes"/>
<layer number="95" name="Names" color="7" fill="1" visible="yes" active="yes"/>
<layer number="96" name="Values" color="7" fill="1" visible="yes" active="yes"/>
<layer number="97" name="Info" color="7" fill="1" visible="yes" active="yes"/>
<layer number="98" name="Guide" color="6" fill="1" visible="yes" active="yes"/>
<layer number="99" name="SpiceOrder" color="5" fill="1" visible="yes" active="yes"/>
</layers>
<schematic xreflabel="%F%N/%S.%C%R" xrefpart="/%S.%C%R">
<libraries>
<library name="Fuse Holder" urn="urn:adsk.eagle:library:15336057">
<description>&lt;h3&gt; PCBLayout.com - Frequently Used &lt;i&gt;Fuse Holders&lt;/i&gt;&lt;/h3&gt;

Visit us at &lt;a href="http://www.PCBLayout.com"&gt;PCBLayout.com&lt;/a&gt; for quick and hassle-free PCB Layout/Manufacturing ordering experience.
&lt;BR&gt;
&lt;BR&gt;
This library has been generated by our experienced pcb layout engineers using current IPC and/or industry standards. We &lt;b&gt;believe&lt;/b&gt; the content to be accurate, complete and current. But, this content is provided as a courtesy and &lt;u&gt;user assumes all risk and responsiblity of it's usage&lt;/u&gt;.
&lt;BR&gt;
&lt;BR&gt;
Feel free to contact us at &lt;a href="mailto:Support@PCBLayout.com"&gt;Support@PCBLayout.com&lt;/a&gt; if you have any questions/concerns regarding any of our content or services.</description>
<packages>
<package name="65800001109" urn="urn:adsk.eagle:footprint:15295193/2" library_version="1">
<smd name="1" x="-8.5" y="0" dx="6" dy="6" layer="1"/>
<smd name="2" x="8.5" y="0" dx="6" dy="6" layer="1"/>
<wire x1="-11.35" y1="5.4" x2="11.35" y2="5.4" width="0.127" layer="51"/>
<wire x1="11.35" y1="5.4" x2="11.35" y2="-5.4" width="0.127" layer="51"/>
<wire x1="11.35" y1="-5.4" x2="-11.35" y2="-5.4" width="0.127" layer="51"/>
<wire x1="-11.35" y1="-5.4" x2="-11.35" y2="5.4" width="0.127" layer="51"/>
<wire x1="-11.35" y1="3.3" x2="-11.35" y2="5.4" width="0.127" layer="21"/>
<wire x1="-11.35" y1="5.4" x2="11.35" y2="5.4" width="0.127" layer="21"/>
<wire x1="11.35" y1="5.4" x2="11.35" y2="3.4" width="0.127" layer="21"/>
<wire x1="-11.35" y1="-3.4" x2="-11.35" y2="-5.4" width="0.127" layer="21"/>
<wire x1="-11.35" y1="-5.4" x2="11.35" y2="-5.4" width="0.127" layer="21"/>
<wire x1="11.35" y1="-5.4" x2="11.35" y2="-3.7" width="0.127" layer="21"/>
<wire x1="-11.75" y1="5.75" x2="-11.75" y2="-5.75" width="0.05" layer="39"/>
<wire x1="-11.75" y1="-5.75" x2="11.75" y2="-5.75" width="0.05" layer="39"/>
<wire x1="11.75" y1="-5.75" x2="11.75" y2="5.75" width="0.05" layer="39"/>
<wire x1="11.75" y1="5.75" x2="-11.75" y2="5.75" width="0.05" layer="39"/>
<text x="-11.43" y="6.35" size="1.27" layer="25">&gt;NAME</text>
<text x="-11.43" y="-7.62" size="1.27" layer="27">&gt;VALUE</text>
</package>
</packages>
<packages3d>
<package3d name="65800001109" urn="urn:adsk.eagle:package:15295200/2" type="box" library_version="1">
<packageinstances>
<packageinstance name="65800001109"/>
</packageinstances>
</package3d>
</packages3d>
<symbols>
<symbol name="FUSE" urn="urn:adsk.eagle:symbol:15295199/1" library_version="1">
<pin name="1" x="-7.62" y="0" visible="off" length="short" direction="pas"/>
<pin name="2" x="7.62" y="0" visible="off" length="short" direction="pas" rot="R180"/>
<wire x1="0" y1="0" x2="-3.81" y2="0" width="0.254" layer="94" curve="180"/>
<wire x1="-5.08" y1="0" x2="-3.81" y2="0" width="0.254" layer="94"/>
<wire x1="0" y1="0" x2="3.81" y2="0" width="0.254" layer="94" curve="180"/>
<wire x1="3.81" y1="0" x2="5.08" y2="0" width="0.254" layer="94"/>
<text x="-2.54" y="3.302" size="1.27" layer="95">&gt;NAME</text>
<text x="-2.54" y="-4.064" size="1.27" layer="96">&gt;VALUE</text>
</symbol>
</symbols>
<devicesets>
<deviceset name="65800001109" urn="urn:adsk.eagle:component:15295206/2" prefix="F" library_version="1">
<description>&lt;h3&gt; FUSE BLOK CARTRIDGE 250V 10A SMD &lt;/h3&gt;
&lt;BR&gt;
&lt;a href="https://www.littelfuse.com/~/media/electronics/datasheets/fuse_blocks/littelfuse_fuse_block_658_datasheet.pdf.pdf"&gt; Manufacturer's datasheet&lt;/a&gt;</description>
<gates>
<gate name="G$1" symbol="FUSE" x="0" y="0"/>
</gates>
<devices>
<device name="" package="65800001109">
<connects>
<connect gate="G$1" pin="1" pad="1"/>
<connect gate="G$1" pin="2" pad="2"/>
</connects>
<package3dinstances>
<package3dinstance package3d_urn="urn:adsk.eagle:package:15295200/2"/>
</package3dinstances>
<technologies>
<technology name="">
<attribute name="CREATED_BY" value="PCBLayout.com" constant="no"/>
<attribute name="DIGIKEY_PARTNO" value="WK6249TR-ND" constant="no"/>
<attribute name="MANUFACTURER" value="Littelfuse Inc." constant="no"/>
<attribute name="MPN" value="65800001109" constant="no"/>
</technology>
</technologies>
</device>
</devices>
</deviceset>
</devicesets>
</library>
<library name="Diodes" urn="urn:adsk.eagle:library:11396254">
<description>&lt;h3&gt; PCBLayout.com - Frequently Used &lt;i&gt;Diodes&lt;/i&gt;&lt;/h3&gt;

Visit us at &lt;a href="http://www.PCBLayout.com"&gt;PCBLayout.com&lt;/a&gt; for quick and hassle-free PCB Layout/Manufacturing ordering experience.
&lt;BR&gt;
&lt;BR&gt;
This library has been generated by our experienced pcb layout engineers using current IPC and/or industry standards. We &lt;b&gt;believe&lt;/b&gt; the content to be accurate, complete and current. But, this content is provided as a courtesy and &lt;u&gt;user assumes all risk and responsiblity of it's usage&lt;/u&gt;.
&lt;BR&gt;
&lt;BR&gt;
Feel free to contact us at &lt;a href="mailto:Support@PCBLayout.com"&gt;Support@PCBLayout.com&lt;/a&gt; if you have any questions/concerns regarding any of our content or services.</description>
<packages>
<package name="SMA" urn="urn:adsk.eagle:footprint:10898381/1" library_version="1">
<description>Diode, Molded Body; 4.375 mm L X 2.725 mm W X 2.50 mm H body&lt;p&gt;&lt;i&gt;PCB Libraries Packages&lt;/i&gt;</description>
<smd name="C" x="-2.165" y="0" dx="2.28" dy="1.66" layer="1" roundness="30" rot="R180" stop="no" cream="no"/>
<smd name="A" x="2.165" y="0" dx="2.28" dy="1.66" layer="1" roundness="30" stop="no" cream="no"/>
<polygon width="0.01" layer="29">
<vertex x="-2.165" y="0.83"/>
<vertex x="-1.275" y="0.83"/>
<vertex x="-1.2359" y="0.8269"/>
<vertex x="-1.1977" y="0.8178"/>
<vertex x="-1.1615" y="0.8028"/>
<vertex x="-1.1281" y="0.7823"/>
<vertex x="-1.0982" y="0.7568"/>
<vertex x="-1.0727" y="0.7269"/>
<vertex x="-1.0522" y="0.6935"/>
<vertex x="-1.0372" y="0.6573"/>
<vertex x="-1.0281" y="0.6191"/>
<vertex x="-1.025" y="-0.58"/>
<vertex x="-1.0281" y="-0.6191"/>
<vertex x="-1.0372" y="-0.6573"/>
<vertex x="-1.0522" y="-0.6935"/>
<vertex x="-1.0727" y="-0.7269"/>
<vertex x="-1.0982" y="-0.7568"/>
<vertex x="-1.1281" y="-0.7823"/>
<vertex x="-1.1615" y="-0.8028"/>
<vertex x="-1.1977" y="-0.8178"/>
<vertex x="-1.2359" y="-0.8269"/>
<vertex x="-1.275" y="-0.83"/>
<vertex x="-3.055" y="-0.83"/>
<vertex x="-3.0941" y="-0.8269"/>
<vertex x="-3.1323" y="-0.8178"/>
<vertex x="-3.1685" y="-0.8028"/>
<vertex x="-3.2019" y="-0.7823"/>
<vertex x="-3.2318" y="-0.7568"/>
<vertex x="-3.2573" y="-0.7269"/>
<vertex x="-3.2778" y="-0.6935"/>
<vertex x="-3.2928" y="-0.6573"/>
<vertex x="-3.3019" y="-0.6191"/>
<vertex x="-3.305" y="0.58"/>
<vertex x="-3.3019" y="0.6191"/>
<vertex x="-3.2928" y="0.6573"/>
<vertex x="-3.2778" y="0.6935"/>
<vertex x="-3.2573" y="0.7269"/>
<vertex x="-3.2318" y="0.7568"/>
<vertex x="-3.2019" y="0.7823"/>
<vertex x="-3.1685" y="0.8028"/>
<vertex x="-3.1323" y="0.8178"/>
<vertex x="-3.0941" y="0.8269"/>
<vertex x="-3.055" y="0.83"/>
</polygon>
<polygon width="0.01" layer="31">
<vertex x="-2.165" y="0.83"/>
<vertex x="-1.275" y="0.83"/>
<vertex x="-1.2359" y="0.8269"/>
<vertex x="-1.1977" y="0.8178"/>
<vertex x="-1.1615" y="0.8028"/>
<vertex x="-1.1281" y="0.7823"/>
<vertex x="-1.0982" y="0.7568"/>
<vertex x="-1.0727" y="0.7269"/>
<vertex x="-1.0522" y="0.6935"/>
<vertex x="-1.0372" y="0.6573"/>
<vertex x="-1.0281" y="0.6191"/>
<vertex x="-1.025" y="-0.58"/>
<vertex x="-1.0281" y="-0.6191"/>
<vertex x="-1.0372" y="-0.6573"/>
<vertex x="-1.0522" y="-0.6935"/>
<vertex x="-1.0727" y="-0.7269"/>
<vertex x="-1.0982" y="-0.7568"/>
<vertex x="-1.1281" y="-0.7823"/>
<vertex x="-1.1615" y="-0.8028"/>
<vertex x="-1.1977" y="-0.8178"/>
<vertex x="-1.2359" y="-0.8269"/>
<vertex x="-1.275" y="-0.83"/>
<vertex x="-3.055" y="-0.83"/>
<vertex x="-3.0941" y="-0.8269"/>
<vertex x="-3.1323" y="-0.8178"/>
<vertex x="-3.1685" y="-0.8028"/>
<vertex x="-3.2019" y="-0.7823"/>
<vertex x="-3.2318" y="-0.7568"/>
<vertex x="-3.2573" y="-0.7269"/>
<vertex x="-3.2778" y="-0.6935"/>
<vertex x="-3.2928" y="-0.6573"/>
<vertex x="-3.3019" y="-0.6191"/>
<vertex x="-3.305" y="0.58"/>
<vertex x="-3.3019" y="0.6191"/>
<vertex x="-3.2928" y="0.6573"/>
<vertex x="-3.2778" y="0.6935"/>
<vertex x="-3.2573" y="0.7269"/>
<vertex x="-3.2318" y="0.7568"/>
<vertex x="-3.2019" y="0.7823"/>
<vertex x="-3.1685" y="0.8028"/>
<vertex x="-3.1323" y="0.8178"/>
<vertex x="-3.0941" y="0.8269"/>
<vertex x="-3.055" y="0.83"/>
</polygon>
<polygon width="0.01" layer="29">
<vertex x="2.165" y="-0.83"/>
<vertex x="1.275" y="-0.83"/>
<vertex x="1.2359" y="-0.8269"/>
<vertex x="1.1977" y="-0.8178"/>
<vertex x="1.1615" y="-0.8028"/>
<vertex x="1.1281" y="-0.7823"/>
<vertex x="1.0982" y="-0.7568"/>
<vertex x="1.0727" y="-0.7269"/>
<vertex x="1.0522" y="-0.6935"/>
<vertex x="1.0372" y="-0.6573"/>
<vertex x="1.0281" y="-0.6191"/>
<vertex x="1.025" y="0.58"/>
<vertex x="1.0281" y="0.6191"/>
<vertex x="1.0372" y="0.6573"/>
<vertex x="1.0522" y="0.6935"/>
<vertex x="1.0727" y="0.7269"/>
<vertex x="1.0982" y="0.7568"/>
<vertex x="1.1281" y="0.7823"/>
<vertex x="1.1615" y="0.8028"/>
<vertex x="1.1977" y="0.8178"/>
<vertex x="1.2359" y="0.8269"/>
<vertex x="1.275" y="0.83"/>
<vertex x="3.055" y="0.83"/>
<vertex x="3.0941" y="0.8269"/>
<vertex x="3.1323" y="0.8178"/>
<vertex x="3.1685" y="0.8028"/>
<vertex x="3.2019" y="0.7823"/>
<vertex x="3.2318" y="0.7568"/>
<vertex x="3.2573" y="0.7269"/>
<vertex x="3.2778" y="0.6935"/>
<vertex x="3.2928" y="0.6573"/>
<vertex x="3.3019" y="0.6191"/>
<vertex x="3.305" y="-0.58"/>
<vertex x="3.3019" y="-0.6191"/>
<vertex x="3.2928" y="-0.6573"/>
<vertex x="3.2778" y="-0.6935"/>
<vertex x="3.2573" y="-0.7269"/>
<vertex x="3.2318" y="-0.7568"/>
<vertex x="3.2019" y="-0.7823"/>
<vertex x="3.1685" y="-0.8028"/>
<vertex x="3.1323" y="-0.8178"/>
<vertex x="3.0941" y="-0.8269"/>
<vertex x="3.055" y="-0.83"/>
</polygon>
<polygon width="0.01" layer="31">
<vertex x="2.165" y="-0.83"/>
<vertex x="1.275" y="-0.83"/>
<vertex x="1.2359" y="-0.8269"/>
<vertex x="1.1977" y="-0.8178"/>
<vertex x="1.1615" y="-0.8028"/>
<vertex x="1.1281" y="-0.7823"/>
<vertex x="1.0982" y="-0.7568"/>
<vertex x="1.0727" y="-0.7269"/>
<vertex x="1.0522" y="-0.6935"/>
<vertex x="1.0372" y="-0.6573"/>
<vertex x="1.0281" y="-0.6191"/>
<vertex x="1.025" y="0.58"/>
<vertex x="1.0281" y="0.6191"/>
<vertex x="1.0372" y="0.6573"/>
<vertex x="1.0522" y="0.6935"/>
<vertex x="1.0727" y="0.7269"/>
<vertex x="1.0982" y="0.7568"/>
<vertex x="1.1281" y="0.7823"/>
<vertex x="1.1615" y="0.8028"/>
<vertex x="1.1977" y="0.8178"/>
<vertex x="1.2359" y="0.8269"/>
<vertex x="1.275" y="0.83"/>
<vertex x="3.055" y="0.83"/>
<vertex x="3.0941" y="0.8269"/>
<vertex x="3.1323" y="0.8178"/>
<vertex x="3.1685" y="0.8028"/>
<vertex x="3.2019" y="0.7823"/>
<vertex x="3.2318" y="0.7568"/>
<vertex x="3.2573" y="0.7269"/>
<vertex x="3.2778" y="0.6935"/>
<vertex x="3.2928" y="0.6573"/>
<vertex x="3.3019" y="0.6191"/>
<vertex x="3.305" y="-0.58"/>
<vertex x="3.3019" y="-0.6191"/>
<vertex x="3.2928" y="-0.6573"/>
<vertex x="3.2778" y="-0.6935"/>
<vertex x="3.2573" y="-0.7269"/>
<vertex x="3.2318" y="-0.7568"/>
<vertex x="3.2019" y="-0.7823"/>
<vertex x="3.1685" y="-0.8028"/>
<vertex x="3.1323" y="-0.8178"/>
<vertex x="3.0941" y="-0.8269"/>
<vertex x="3.055" y="-0.83"/>
</polygon>
<wire x1="-1.465" y1="0.7125" x2="-1.465" y2="-0.7125" width="0.025" layer="51"/>
<wire x1="-1.465" y1="-0.7125" x2="-2.6" y2="-0.7125" width="0.025" layer="51"/>
<wire x1="-2.6" y1="-0.7125" x2="-2.6" y2="0.7125" width="0.025" layer="51"/>
<wire x1="-2.6" y1="0.7125" x2="-1.465" y2="0.7125" width="0.025" layer="51"/>
<wire x1="1.465" y1="-0.7125" x2="1.465" y2="0.7125" width="0.025" layer="51"/>
<wire x1="1.465" y1="0.7125" x2="2.6" y2="0.7125" width="0.025" layer="51"/>
<wire x1="2.6" y1="0.7125" x2="2.6" y2="-0.7125" width="0.025" layer="51"/>
<wire x1="2.6" y1="-0.7125" x2="1.465" y2="-0.7125" width="0.025" layer="51"/>
<wire x1="-2.38" y1="-1.48" x2="-2.38" y2="1.48" width="0.12" layer="51"/>
<wire x1="-2.38" y1="1.48" x2="2.38" y2="1.48" width="0.12" layer="51"/>
<wire x1="2.38" y1="1.48" x2="2.38" y2="-1.48" width="0.12" layer="51"/>
<wire x1="2.38" y1="-1.48" x2="-2.38" y2="-1.48" width="0.12" layer="51"/>
<wire x1="-2.38" y1="1.01" x2="-2.38" y2="1.48" width="0.12" layer="21"/>
<wire x1="2.38" y1="-1.01" x2="2.38" y2="-1.48" width="0.12" layer="21"/>
<wire x1="0.35" y1="0" x2="-0.35" y2="0" width="0.05" layer="39"/>
<wire x1="0" y1="0.35" x2="0" y2="-0.35" width="0.05" layer="39"/>
<wire x1="2.38" y1="-1.48" x2="-2.38" y2="-1.48" width="0.12" layer="21"/>
<wire x1="-2.38" y1="-1.48" x2="-2.38" y2="-1.01" width="0.12" layer="21"/>
<wire x1="-2.38" y1="1.48" x2="2.38" y2="1.48" width="0.12" layer="21"/>
<wire x1="2.38" y1="1.48" x2="2.38" y2="1.01" width="0.12" layer="21"/>
<wire x1="-2.58" y1="-1.68" x2="2.58" y2="-1.68" width="0.05" layer="39"/>
<wire x1="2.58" y1="-1.68" x2="2.58" y2="-1.03" width="0.05" layer="39"/>
<wire x1="2.58" y1="-1.03" x2="3.505" y2="-1.03" width="0.05" layer="39"/>
<wire x1="3.505" y1="-1.03" x2="3.505" y2="1.03" width="0.05" layer="39"/>
<wire x1="3.505" y1="1.03" x2="2.58" y2="1.03" width="0.05" layer="39"/>
<wire x1="2.58" y1="1.03" x2="2.58" y2="1.68" width="0.05" layer="39"/>
<wire x1="2.58" y1="1.68" x2="-2.58" y2="1.68" width="0.05" layer="39"/>
<wire x1="-2.58" y1="1.68" x2="-2.58" y2="1.03" width="0.05" layer="39"/>
<wire x1="-2.58" y1="1.03" x2="-3.505" y2="1.03" width="0.05" layer="39"/>
<wire x1="-3.505" y1="1.03" x2="-3.505" y2="-1.03" width="0.05" layer="39"/>
<wire x1="-3.505" y1="-1.03" x2="-2.58" y2="-1.03" width="0.05" layer="39"/>
<wire x1="-2.58" y1="-1.03" x2="-2.58" y2="-1.68" width="0.05" layer="39"/>
<wire x1="0.25" y1="0.25" x2="0.25" y2="-0.25" width="0.05" layer="21"/>
<wire x1="0.25" y1="-0.25" x2="-0.25" y2="0" width="0.05" layer="21"/>
<wire x1="-0.25" y1="0" x2="0.25" y2="0.25" width="0.05" layer="21"/>
<wire x1="-0.25" y1="0.25" x2="-0.25" y2="-0.25" width="0.05" layer="21"/>
<circle x="0" y="0" radius="0.25" width="0.05" layer="39"/>
<text x="-2.794" y="-3.048" size="1.2" layer="27" ratio="10">&gt;VALUE</text>
<text x="-2.54" y="2.54" size="1.2" layer="25" ratio="10">&gt;NAME</text>
</package>
</packages>
<packages3d>
<package3d name="SMA" urn="urn:adsk.eagle:package:10898394/2" type="model" library_version="1">
<description>Diode, Molded Body; 4.375 mm L X 2.725 mm W X 2.50 mm H body&lt;p&gt;&lt;i&gt;PCB Libraries Packages&lt;/i&gt;</description>
<packageinstances>
<packageinstance name="SMA"/>
</packageinstances>
</package3d>
</packages3d>
<symbols>
<symbol name="SCHOTTKY" urn="urn:adsk.eagle:symbol:10898387/1" library_version="1">
<wire x1="-1.27" y1="-1.27" x2="1.27" y2="0" width="0.254" layer="94"/>
<wire x1="1.27" y1="0" x2="-1.27" y2="1.27" width="0.254" layer="94"/>
<wire x1="1.905" y1="1.27" x2="1.27" y2="1.27" width="0.254" layer="94"/>
<wire x1="1.27" y1="1.27" x2="1.27" y2="0" width="0.254" layer="94"/>
<wire x1="-1.27" y1="1.27" x2="-1.27" y2="0" width="0.254" layer="94"/>
<wire x1="-1.27" y1="0" x2="-1.27" y2="-1.27" width="0.254" layer="94"/>
<wire x1="1.27" y1="0" x2="1.27" y2="-1.27" width="0.254" layer="94"/>
<wire x1="1.905" y1="1.27" x2="1.905" y2="1.016" width="0.254" layer="94"/>
<wire x1="1.27" y1="-1.27" x2="0.635" y2="-1.27" width="0.254" layer="94"/>
<wire x1="0.635" y1="-1.016" x2="0.635" y2="-1.27" width="0.254" layer="94"/>
<wire x1="-1.27" y1="0" x2="-2.54" y2="0" width="0.254" layer="94"/>
<wire x1="1.27" y1="0" x2="2.54" y2="0" width="0.254" layer="94"/>
<text x="-2.286" y="1.905" size="1.778" layer="95">&gt;NAME</text>
<text x="-2.286" y="-3.429" size="1.778" layer="96">&gt;VALUE</text>
<pin name="A" x="-2.54" y="0" visible="off" length="point" direction="pas"/>
<pin name="C" x="2.54" y="0" visible="off" length="point" direction="pas" rot="R180"/>
</symbol>
</symbols>
<devicesets>
<deviceset name="SS12" urn="urn:adsk.eagle:component:10898405/9" prefix="D" library_version="1">
<description>&lt;h3&gt; DIODE SCHOTTKY 20V 1A SMA &lt;/h3&gt;
&lt;BR&gt;
&lt;a href="https://www.onsemi.com/pub/Collateral/SS19-D.PDF"&gt; Manufacturer's datasheet&lt;/a&gt;</description>
<gates>
<gate name="G$1" symbol="SCHOTTKY" x="0" y="0"/>
</gates>
<devices>
<device name="" package="SMA">
<connects>
<connect gate="G$1" pin="A" pad="A"/>
<connect gate="G$1" pin="C" pad="C"/>
</connects>
<package3dinstances>
<package3dinstance package3d_urn="urn:adsk.eagle:package:10898394/2"/>
</package3dinstances>
<technologies>
<technology name="">
<attribute name="CREATED_BY" value="PCBLayout.com" constant="no"/>
<attribute name="DIGIKEY_PART_NUMBER" value="SS12FSCT-ND" constant="no"/>
<attribute name="MANUFACTURER" value="ON Semiconductor" constant="no"/>
<attribute name="MPN" value="SS12" constant="no"/>
<attribute name="PACKAGE" value="SMA (DO-214AC)" constant="no"/>
</technology>
</technologies>
</device>
</devices>
</deviceset>
</devicesets>
</library>
<library name="con-molex">
<description>&lt;b&gt;Molex Connectors&lt;/b&gt;&lt;p&gt;
&lt;author&gt;Created by librarian@cadsoft.de&lt;/author&gt;</description>
<packages>
<package name="22-23-2021">
<description>.100" (2.54mm) Center Headers - 2 Pin</description>
<wire x1="-2.54" y1="3.175" x2="2.54" y2="3.175" width="0.254" layer="21"/>
<wire x1="2.54" y1="3.175" x2="2.54" y2="1.27" width="0.254" layer="21"/>
<wire x1="2.54" y1="1.27" x2="2.54" y2="-3.175" width="0.254" layer="21"/>
<wire x1="2.54" y1="-3.175" x2="-2.54" y2="-3.175" width="0.254" layer="21"/>
<wire x1="-2.54" y1="-3.175" x2="-2.54" y2="1.27" width="0.254" layer="21"/>
<wire x1="-2.54" y1="1.27" x2="-2.54" y2="3.175" width="0.254" layer="21"/>
<wire x1="-2.54" y1="1.27" x2="2.54" y2="1.27" width="0.254" layer="21"/>
<pad name="1" x="-1.27" y="0" drill="1.27" shape="long" rot="R90"/>
<pad name="2" x="1.27" y="0" drill="1.27" shape="long" rot="R90"/>
<text x="-2.54" y="3.81" size="1.016" layer="25" ratio="10">&gt;NAME</text>
<text x="-2.54" y="-5.08" size="1.016" layer="27" ratio="10">&gt;VALUE</text>
</package>
<package name="2PIN">
<description>.100" (2.54mm) Center Headers - 2 Pin</description>
<wire x1="-3.81" y1="3.175" x2="3.81" y2="3.175" width="0.254" layer="21"/>
<wire x1="3.81" y1="3.175" x2="3.81" y2="1.27" width="0.254" layer="21"/>
<wire x1="3.81" y1="1.27" x2="3.81" y2="-3.175" width="0.254" layer="21"/>
<wire x1="3.81" y1="-3.175" x2="-3.81" y2="-3.175" width="0.254" layer="21"/>
<wire x1="-3.81" y1="-3.175" x2="-3.81" y2="1.27" width="0.254" layer="21"/>
<wire x1="-3.81" y1="1.27" x2="-3.81" y2="3.175" width="0.254" layer="21"/>
<wire x1="-3.81" y1="1.27" x2="3.81" y2="1.27" width="0.254" layer="21"/>
<pad name="1" x="-2.032" y="0" drill="2.032" shape="long" rot="R90"/>
<pad name="2" x="2.032" y="0" drill="2.032" shape="long" rot="R90"/>
<text x="-2.54" y="3.81" size="1.016" layer="25" ratio="10">&gt;NAME</text>
<text x="-2.54" y="-5.08" size="1.016" layer="27" ratio="10">&gt;VALUE</text>
</package>
</packages>
<symbols>
<symbol name="MV">
<wire x1="1.27" y1="0" x2="0" y2="0" width="0.6096" layer="94"/>
<text x="2.54" y="-0.762" size="1.524" layer="95">&gt;NAME</text>
<text x="-0.762" y="1.397" size="1.778" layer="96">&gt;VALUE</text>
<pin name="S" x="-2.54" y="0" visible="off" length="short" direction="pas"/>
</symbol>
<symbol name="M">
<wire x1="1.27" y1="0" x2="0" y2="0" width="0.6096" layer="94"/>
<text x="2.54" y="-0.762" size="1.524" layer="95">&gt;NAME</text>
<pin name="S" x="-2.54" y="0" visible="off" length="short" direction="pas"/>
</symbol>
</symbols>
<devicesets>
<deviceset name="22-23-2021" prefix="X">
<description>.100" (2.54mm) Center Header - 2 Pin</description>
<gates>
<gate name="-1" symbol="MV" x="0" y="0" addlevel="always" swaplevel="1"/>
<gate name="-2" symbol="M" x="0" y="-2.54" addlevel="always" swaplevel="1"/>
</gates>
<devices>
<device name="" package="22-23-2021">
<connects>
<connect gate="-1" pin="S" pad="1"/>
<connect gate="-2" pin="S" pad="2"/>
</connects>
<technologies>
<technology name="">
<attribute name="MF" value="MOLEX" constant="no"/>
<attribute name="MPN" value="22-23-2021" constant="no"/>
<attribute name="OC_FARNELL" value="1462926" constant="no"/>
<attribute name="OC_NEWARK" value="25C3832" constant="no"/>
</technology>
</technologies>
</device>
<device name="2PIN" package="2PIN">
<connects>
<connect gate="-1" pin="S" pad="1"/>
<connect gate="-2" pin="S" pad="2"/>
</connects>
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
</devicesets>
</library>
<library name="supply1">
<description>&lt;b&gt;Supply Symbols&lt;/b&gt;&lt;p&gt;
 GND, VCC, 0V, +5V, -5V, etc.&lt;p&gt;
 Please keep in mind, that these devices are necessary for the
 automatic wiring of the supply signals.&lt;p&gt;
 The pin name defined in the symbol is identical to the net which is to be wired automatically.&lt;p&gt;
 In this library the device names are the same as the pin names of the symbols, therefore the correct signal names appear next to the supply symbols in the schematic.&lt;p&gt;
 &lt;author&gt;Created by librarian@cadsoft.de&lt;/author&gt;</description>
<packages>
</packages>
<symbols>
<symbol name="GND">
<wire x1="-1.905" y1="0" x2="1.905" y2="0" width="0.254" layer="94"/>
<text x="-2.54" y="-2.54" size="1.778" layer="96">&gt;VALUE</text>
<pin name="GND" x="0" y="2.54" visible="off" length="short" direction="sup" rot="R270"/>
</symbol>
</symbols>
<devicesets>
<deviceset name="GND" prefix="GND">
<description>&lt;b&gt;SUPPLY SYMBOL&lt;/b&gt;</description>
<gates>
<gate name="1" symbol="GND" x="0" y="0"/>
</gates>
<devices>
<device name="">
<technologies>
<technology name=""/>
</technologies>
</device>
</devices>
</deviceset>
</devicesets>
</library>
</libraries>
<attributes>
</attributes>
<variantdefs>
</variantdefs>
<classes>
<class number="0" name="default" width="0" drill="0">
</class>
</classes>
<parts>
<part name="F1" library="Fuse Holder" library_urn="urn:adsk.eagle:library:15336057" deviceset="65800001109" device="" package3d_urn="urn:adsk.eagle:package:15295200/2" override_package3d_urn="urn:adsk.eagle:package:42685230/2" override_package_urn="urn:adsk.eagle:footprint:15295193/2" value="ESKA PTF/18SMD 5A 230V"/>
<part name="D1" library="Diodes" library_urn="urn:adsk.eagle:library:11396254" deviceset="SS12" device="" package3d_urn="urn:adsk.eagle:package:10898394/2" value="SK36SMA-AQ"/>
<part name="D2" library="Diodes" library_urn="urn:adsk.eagle:library:11396254" deviceset="SS12" device="" package3d_urn="urn:adsk.eagle:package:10898394/2" value="SK36SMA-AQ"/>
<part name="X1" library="con-molex" deviceset="22-23-2021" device="2PIN" override_package3d_urn="urn:adsk.eagle:package:42685318/2" override_package_urn="urn:adsk.eagle:footprint:42685319/1" value="DC1 IN"/>
<part name="X2" library="con-molex" deviceset="22-23-2021" device="2PIN" override_package3d_urn="urn:adsk.eagle:package:42685367/2" override_package_urn="urn:adsk.eagle:footprint:42685369/1" value="DC2 IN"/>
<part name="X3" library="con-molex" deviceset="22-23-2021" device="2PIN" override_package3d_urn="urn:adsk.eagle:package:42685373/2" override_package_urn="urn:adsk.eagle:footprint:42685374/1" value="DC1 OUT"/>
<part name="X4" library="con-molex" deviceset="22-23-2021" device="2PIN" override_package3d_urn="urn:adsk.eagle:package:42685376/2" override_package_urn="urn:adsk.eagle:footprint:42685377/1" value="DC2 OUT"/>
<part name="GND1" library="supply1" deviceset="GND" device=""/>
<part name="GND2" library="supply1" deviceset="GND" device=""/>
<part name="GND3" library="supply1" deviceset="GND" device=""/>
<part name="GND4" library="supply1" deviceset="GND" device=""/>
</parts>
<sheets>
<sheet>
<plain>
</plain>
<instances>
<instance part="F1" gate="G$1" x="38.1" y="88.9" smashed="yes">
<attribute name="NAME" x="35.56" y="92.202" size="1.27" layer="95"/>
<attribute name="VALUE" x="35.56" y="84.836" size="1.27" layer="96"/>
</instance>
<instance part="D1" gate="G$1" x="15.24" y="88.9" smashed="yes">
<attribute name="NAME" x="12.954" y="90.805" size="1.778" layer="95"/>
<attribute name="VALUE" x="12.954" y="85.471" size="1.778" layer="96"/>
</instance>
<instance part="D2" gate="G$1" x="15.24" y="73.66" smashed="yes">
<attribute name="NAME" x="12.954" y="75.565" size="1.778" layer="95"/>
<attribute name="VALUE" x="12.954" y="70.231" size="1.778" layer="96"/>
</instance>
<instance part="X1" gate="-1" x="2.54" y="88.9" smashed="yes" rot="R180">
<attribute name="NAME" x="0" y="89.662" size="1.524" layer="95" rot="R180"/>
<attribute name="VALUE" x="-1.778" y="92.583" size="1.778" layer="96" rot="R180"/>
</instance>
<instance part="X1" gate="-2" x="2.54" y="86.36" smashed="yes" rot="R180">
<attribute name="NAME" x="0" y="87.122" size="1.524" layer="95" rot="R180"/>
</instance>
<instance part="X2" gate="-1" x="2.54" y="73.66" smashed="yes" rot="R180">
<attribute name="NAME" x="0" y="74.422" size="1.524" layer="95" rot="R180"/>
<attribute name="VALUE" x="-1.778" y="77.343" size="1.778" layer="96" rot="R180"/>
</instance>
<instance part="X2" gate="-2" x="2.54" y="71.12" smashed="yes" rot="R180">
<attribute name="NAME" x="0" y="71.882" size="1.524" layer="95" rot="R180"/>
</instance>
<instance part="X3" gate="-1" x="76.2" y="88.9" smashed="yes">
<attribute name="NAME" x="78.74" y="88.138" size="1.524" layer="95"/>
<attribute name="VALUE" x="75.438" y="90.297" size="1.778" layer="96"/>
</instance>
<instance part="X3" gate="-2" x="76.2" y="86.36" smashed="yes">
<attribute name="NAME" x="78.74" y="85.598" size="1.524" layer="95"/>
</instance>
<instance part="X4" gate="-1" x="76.2" y="73.66" smashed="yes">
<attribute name="NAME" x="78.74" y="72.898" size="1.524" layer="95"/>
<attribute name="VALUE" x="75.438" y="75.057" size="1.778" layer="96"/>
</instance>
<instance part="X4" gate="-2" x="76.2" y="71.12" smashed="yes">
<attribute name="NAME" x="78.74" y="70.358" size="1.524" layer="95"/>
</instance>
<instance part="GND1" gate="1" x="10.16" y="68.58" smashed="yes">
<attribute name="VALUE" x="7.62" y="66.04" size="1.778" layer="96"/>
</instance>
<instance part="GND2" gate="1" x="10.16" y="83.82" smashed="yes">
<attribute name="VALUE" x="7.62" y="81.28" size="1.778" layer="96"/>
</instance>
<instance part="GND3" gate="1" x="66.04" y="68.58" smashed="yes">
<attribute name="VALUE" x="63.5" y="66.04" size="1.778" layer="96"/>
</instance>
<instance part="GND4" gate="1" x="66.04" y="83.82" smashed="yes">
<attribute name="VALUE" x="63.5" y="81.28" size="1.778" layer="96"/>
</instance>
</instances>
<busses>
</busses>
<nets>
<net name="V1+" class="0">
<segment>
<pinref part="X1" gate="-1" pin="S"/>
<pinref part="D1" gate="G$1" pin="A"/>
<wire x1="5.08" y1="88.9" x2="12.7" y2="88.9" width="0.1524" layer="91"/>
</segment>
</net>
<net name="V+" class="0">
<segment>
<pinref part="D1" gate="G$1" pin="C"/>
<pinref part="F1" gate="G$1" pin="1"/>
<wire x1="17.78" y1="88.9" x2="25.4" y2="88.9" width="0.1524" layer="91"/>
<pinref part="D2" gate="G$1" pin="C"/>
<wire x1="25.4" y1="88.9" x2="30.48" y2="88.9" width="0.1524" layer="91"/>
<wire x1="17.78" y1="73.66" x2="25.4" y2="73.66" width="0.1524" layer="91"/>
<wire x1="25.4" y1="73.66" x2="25.4" y2="88.9" width="0.1524" layer="91"/>
<junction x="25.4" y="88.9"/>
</segment>
</net>
<net name="V2+" class="0">
<segment>
<pinref part="X2" gate="-1" pin="S"/>
<pinref part="D2" gate="G$1" pin="A"/>
<wire x1="5.08" y1="73.66" x2="12.7" y2="73.66" width="0.1524" layer="91"/>
</segment>
</net>
<net name="V+F" class="0">
<segment>
<pinref part="F1" gate="G$1" pin="2"/>
<pinref part="X3" gate="-1" pin="S"/>
<wire x1="45.72" y1="88.9" x2="58.42" y2="88.9" width="0.1524" layer="91"/>
<pinref part="X4" gate="-1" pin="S"/>
<wire x1="58.42" y1="88.9" x2="73.66" y2="88.9" width="0.1524" layer="91"/>
<wire x1="58.42" y1="88.9" x2="58.42" y2="73.66" width="0.1524" layer="91"/>
<wire x1="58.42" y1="73.66" x2="73.66" y2="73.66" width="0.1524" layer="91"/>
<junction x="58.42" y="88.9"/>
</segment>
</net>
<net name="GND" class="0">
<segment>
<pinref part="X1" gate="-2" pin="S"/>
<pinref part="GND2" gate="1" pin="GND"/>
<wire x1="5.08" y1="86.36" x2="10.16" y2="86.36" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="X2" gate="-2" pin="S"/>
<pinref part="GND1" gate="1" pin="GND"/>
<wire x1="5.08" y1="71.12" x2="10.16" y2="71.12" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="GND3" gate="1" pin="GND"/>
<pinref part="X4" gate="-2" pin="S"/>
<wire x1="66.04" y1="71.12" x2="73.66" y2="71.12" width="0.1524" layer="91"/>
</segment>
<segment>
<pinref part="GND4" gate="1" pin="GND"/>
<pinref part="X3" gate="-2" pin="S"/>
<wire x1="66.04" y1="86.36" x2="73.66" y2="86.36" width="0.1524" layer="91"/>
</segment>
</net>
</nets>
</sheet>
</sheets>
</schematic>
</drawing>
<compatibility>
<note version="8.2" severity="warning">
Since Version 8.2, EAGLE supports online libraries. The ids
of those online libraries will not be understood (or retained)
with this version.
</note>
<note version="8.3" severity="warning">
Since Version 8.3, EAGLE supports URNs for individual library
assets (packages, symbols, and devices). The URNs of those assets
will not be understood (or retained) with this version.
</note>
<note version="8.3" severity="warning">
Since Version 8.3, EAGLE supports the association of 3D packages
with devices in libraries, schematics, and board files. Those 3D
packages will not be understood (or retained) with this version.
</note>
<note version="9.4" severity="warning">
Since Version 9.4, EAGLE supports the overriding of 3D packages
in schematics and board files. Those overridden 3d packages
will not be understood (or retained) with this version.
</note>
</compatibility>
</eagle>
