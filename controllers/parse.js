const axios = require("axios");
const xml2js = require("xml2js");
const util = require("util")
const getRepositoryList = async(req, res) => {
    try {
        
        const token = req.get("Authorization");

        const {data} = await axios.get("https://api.github.com/user/repos", {
                headers: {
                    Authorization: `token ${token}`
                }
            })

        return res.status(200).json({
            status: true,
            repo_list: data
        })



    } catch (error) {
        console.log(error);
        return res.status(200).json({
            status: false,
            message: "Internal Server Error"
        })
    }
}

const getDependencies = async (req, res) => {
    try {
      const token = req.get("Authorization");
      const { owner, repo } = req.query;
      const final_answer = [];
  
      const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents`, {
        headers: {
          Authorization: `token ${token}`
        }
      });
  
      const pomFiles = data.filter((each) => each.name === "pom.xml");
  
      if (pomFiles.length === 0) {
        return res.status(200).json({
          status: false,
          message: "No POM file found"
        });
      }
  
      for (const pomFile of pomFiles) {
        const { data } = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${pomFile.path}`, {
          headers: {
            Authorization: `token ${token}`
          }
        });
  
        const decodedData = Buffer.from(data.content, 'base64').toString('utf-8');
  
        const parsePromise = new Promise((resolve) => {
          const parser = new xml2js.Parser();
          parser.parseString(decodedData, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              const dependencies = result?.project?.dependencyManagement[0]?.dependencies[0]?.dependency;
              if (dependencies) {
                final_answer.push(
                  ...dependencies.map((dep) => `${dep?.groupId && dep?.groupId[0]}: Version ${dep?.version && dep?.version[0]}`)
                );
              }
            }
            resolve();
          });
        });
  
        await parsePromise;
      }
  
      return res.status(200).json({
        status: true,
        parsed_string: final_answer
      });
  
    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: false,
        message: "Internal Server Error"
      });
    }
  };


module.exports ={
    getRepositoryList,
    getDependencies
}