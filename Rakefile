require 'rake'
require 'os'

desc "Compile CSS files"
task :css do
  puts "Merging CSS"

  if OS.windows?
      `del static\\css\\style.css`
      `del static\\css\\temp.css`

      %W{font-awesome syntax skeleton base layout gridtable}.each do |file|
        `type static\\css\\#{file}.css >> static\\css\\temp.css`
      end

      `java -jar ..\\development\\yuicompressor\\yuicompressor-2.4.7.jar static\\css\\temp.css > static\\css\\style.css`

    puts 'CSS dumped to static\\css\\style.css'
  else
      `rm static/css/style.css`
      `rm static/css/temp.css`

      %W{font-awesome syntax skeleton base layout gridtable}.each do |file|
        `cat static/css/#{file}.css >> static/css/temp.css`
      end

      `yui-compressor static/css/temp.css > static/css/style.css`

    puts 'CSS dumped to static/css/style.css'
  end

end

desc "Deploy site"
task :deploy do
  Rake::Task['css'].execute
  puts 'Comitting generated CSS'
  `git add static/css/style.css`
  `git commit -m "Compressed CSS for deploy"`

  puts "Pushing to Github"
  `git push origin master`
end

task "Serve"
task :serve do
  Rake::Task['css'].execute

  if OS.windows?
    `set LANG=en_EN.UTF-8 && jekyll --serve`
  else
    `jekyll serve --watch`
  end
end
