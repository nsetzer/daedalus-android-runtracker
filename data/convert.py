import json

"""
generate a javascript source file containing a mapping of zip codes to lat,lon

raw csv data can be found here:

https://public.opendatasoft.com/explore/dataset/us-zip-code-latitude-and-longitude/export/

"""

def parse_csv(path):

    with open(path) as rf:
        rf.readline(); # skip header
        for line in rf:
            parts = line.strip().split(";")
            zip = parts[0]
            lat, lon = [p for p in parts[-1].split(',')]
            yield zip, lat, lon

def main():

    path = "us-zip-code-latitude-and-longitude.csv"
    with open("../resources/zipcodes.js", "w") as wf:

        wf.write("const zipcode_raw = '[");
        iter = parse_csv(path)

        zip, lat, lon = next(iter)
        wf.write("[%s,%s,\"%s\"]" % (lat, lon, zip))
        for zip, lat, lon in iter:
            wf.write(",[%s,%s,\"%s\"]" % (lat, lon, zip))
        wf.write("]';\n");
        wf.write("const zipcode_dat = JSON.parse(zipcode_raw);\n");
        wf.write("const zipcode_lat = 0;\n");
        wf.write("const zipcode_lon = 1;\n");
        wf.write("const zipcode_zip = 2;\n");

if __name__ == '__main__':
    main()